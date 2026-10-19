import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Appointment } from '../types';
import { activityLogService } from './activityLogService';

let memoryAppointmentsCache: Appointment[] = [];

export const appointmentService = {
  // Obtiene todas las citas ordenadas cronológicamente
  async getAppointments(): Promise<Appointment[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('appointment_date', { ascending: true });
        if (!error && data) {
          memoryAppointmentsCache = data as Appointment[];
          return memoryAppointmentsCache;
        }
      } catch (err) {
        console.warn('Supabase appointments fetch failed', err);
      }
    }
    return memoryAppointmentsCache;
  },

  // Obtiene una cita por su ID específico
  async getAppointmentById(id: string): Promise<Appointment | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) return data as Appointment;
      } catch (err) {
        console.warn('Supabase fetch appointment by ID failed', err);
      }
    }
    return memoryAppointmentsCache.find(a => a.id === id) || null;
  },

  // Consulta los horarios ya ocupados en una fecha dada para evitar choques de citas
  async getBookedSlots(date: string): Promise<string[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('appointment_time')
          .eq('appointment_date', date)
          .neq('status', 'cancelled');
        if (!error && data) {
          return data.map((d: any) => {
            // Normalizar a formato HH:MM (ej. "11:00:00" -> "11:00")
            const timeStr = String(d.appointment_time || '');
            return timeStr.length >= 5 ? timeStr.substring(0, 5) : timeStr;
          });
        }
      } catch (err) {
        console.warn('Error fetching booked slots:', err);
      }
    }
    return memoryAppointmentsCache
      .filter(a => a.appointment_date === date && a.status !== 'cancelled')
      .map(a => a.appointment_time.substring(0, 5));
  },

  // Crea una nueva cita (garantizando UUID para compatibilidad con Supabase)
  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    // Generar UUID estándar v4 para compatibilidad con la columna uuid de Postgres
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');

    // Consolidar notas con dirección y ciudad para preservación total
    const fullNotes = [
      appointment.city ? `Ciudad: ${appointment.city}` : '',
      appointment.address ? `Dirección de Visita: ${appointment.address}` : '',
      appointment.notes ? `Notas: ${appointment.notes}` : ''
    ].filter(Boolean).join(' | ');

    const newAppointment: Appointment = {
      ...appointment,
      id: newId,
      notes: fullNotes || appointment.notes,
      created_at: new Date().toISOString()
    };

    let result = newAppointment;

    if (isSupabaseConfigured()) {
      try {
        const payload: Record<string, any> = {
          id: newId,
          customer_name: appointment.customer_name,
          customer_email: appointment.customer_email,
          customer_phone: appointment.customer_phone,
          service_type: appointment.service_type,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time.includes(':') && appointment.appointment_time.length === 5 
            ? `${appointment.appointment_time}:00` 
            : appointment.appointment_time,
          status: appointment.status || 'pending',
          payment_status: appointment.payment_status || 'unpaid',
          price: appointment.price,
          notes: fullNotes
        };

        const { data, error } = await supabase
          .from('appointments')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          result = data as Appointment;
        } else if (error) {
          console.error('Supabase appointment insert error:', error);
        }
      } catch (err) {
        console.error('Supabase appointment creation error:', err);
      }
    }

    memoryAppointmentsCache = [result, ...memoryAppointmentsCache];

    activityLogService.logActivity({
      entity_type: 'appointment',
      entity_id: result.id,
      entity_name: result.customer_name,
      action: 'create',
      description: `Registró cita de "${result.service_type}" para ${result.customer_name}`,
      details: `Fecha: ${result.appointment_date} ${result.appointment_time} | Teléfono: ${result.customer_phone} | Monto: $${result.price}`
    });

    return result;
  },

  // Actualiza el estado de la cita
  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    let updated: Appointment | null = null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) updated = data as Appointment;
      } catch (err) {
        console.error('Supabase update status error:', err);
      }
    }

    if (!updated) {
      const index = memoryAppointmentsCache.findIndex(a => a.id === id);
      if (index !== -1) {
        memoryAppointmentsCache[index].status = status;
        updated = memoryAppointmentsCache[index];
      }
    }

    if (updated) {
      activityLogService.logActivity({
        entity_type: 'appointment',
        entity_id: id,
        entity_name: updated.customer_name,
        action: 'status_change',
        description: `Cambió estado de la cita de ${updated.customer_name} a "${status}"`,
        details: `Servicio: ${updated.service_type} | Fecha: ${updated.appointment_date}`
      });
    }

    return updated;
  },

  // Actualiza estado de pago al ser aprobado por Bold
  async updateAppointmentPayment(id: string, paymentStatus: 'paid' | 'unpaid' | 'refunded', status: 'confirmed' | 'pending' | 'completed' | 'cancelled'): Promise<Appointment | null> {
    let updated: Appointment | null = null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .update({ payment_status: paymentStatus, status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) updated = data as Appointment;
      } catch (err) {
        console.error('Supabase update appointment payment error:', err);
      }
    }

    if (!updated) {
      const index = memoryAppointmentsCache.findIndex(a => a.id === id);
      if (index !== -1) {
        memoryAppointmentsCache[index].payment_status = paymentStatus;
        memoryAppointmentsCache[index].status = status;
        updated = memoryAppointmentsCache[index];
      }
    }

    if (updated) {
      activityLogService.logActivity({
        entity_type: 'appointment',
        entity_id: id,
        entity_name: updated.customer_name,
        action: 'update',
        description: `Confirmó pago (${paymentStatus}) para la cita de ${updated.customer_name}`,
        details: `Servicio: ${updated.service_type} | Monto: $${updated.price}`
      });

      // Disparar sincronización con Zuhuy si existe webhook configurado
      this.notifyZuhuyWebhook(updated);
    }

    return updated;
  },

  // Generador de enlace directo para Google Calendar con 1 clic (sin permisos OAuth)
  generateGoogleCalendarUrl(appointment: Appointment): string {
    const title = encodeURIComponent(`Diseño Tu Espacio: ${appointment.service_type} (${appointment.customer_name})`);
    
    // Normalizar hora de inicio y fin (ej. 90 minutos de duración estándar)
    const timeParts = (appointment.appointment_time || '10:00').split(':');
    const startHour = parseInt(timeParts[0], 10) || 10;
    const startMin = parseInt(timeParts[1], 10) || 0;
    
    const startDate = new Date(`${appointment.appointment_date}T${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}:00`);
    const endDate = new Date(startDate.getTime() + 90 * 60 * 1000); // 90 min

    const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

    const details = encodeURIComponent(
      `Cita de Asesoría de Interiorismo e Iluminación\n\n` +
      `Cliente: ${appointment.customer_name}\n` +
      `Teléfono: ${appointment.customer_phone}\n` +
      `Email: ${appointment.customer_email}\n` +
      `Servicio: ${appointment.service_type}\n` +
      `Monto Pagado: $${appointment.price?.toLocaleString('es-CO')} COP\n` +
      `Notas / Dirección: ${appointment.notes || 'A coordinar'}\n\n` +
      `Atendido por: Equipo de Arquitectura e Interiorismo de Diseño Tu Espacio`
    );

    const location = encodeURIComponent(appointment.address || appointment.city || 'Bogotá D.C., Colombia');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  },

  // Dispara webhook hacia Zuhuy / CRM si está configurado en .env
  async notifyZuhuyWebhook(appointment: Appointment): Promise<void> {
    const webhookUrl = (import.meta as any).env?.VITE_ZUHUY_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'appointment.confirmed',
          source: 'diseno_tu_espacio_web',
          data: appointment,
          timestamp: new Date().toISOString()
        })
      });
      console.log('✅ Cita sincronizada exitosamente con webhook de Zuhuy');
    } catch (err) {
      console.warn('⚠️ No se pudo enviar notificación al webhook de Zuhuy:', err);
    }
  }
};
