import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Appointment } from '../types';
import { MOCK_APPOINTMENTS } from './mockData';

const LOCAL_STORAGE_APPOINTMENTS_KEY = 'luxe_appointments_cache';

const getStoredAppointments = (): Appointment[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_APPOINTMENTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(LOCAL_STORAGE_APPOINTMENTS_KEY, JSON.stringify(MOCK_APPOINTMENTS));
  return MOCK_APPOINTMENTS;
};

const saveStoredAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(LOCAL_STORAGE_APPOINTMENTS_KEY, JSON.stringify(appointments));
};

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('appointment_date', { ascending: true });
        if (!error && data) return data as Appointment[];
      } catch (err) {
        console.warn('Supabase appointments fetch failed, using fallback cache', err);
      }
    }
    return getStoredAppointments();
  },

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newId = `app-${Date.now()}`;
    const newAppointment: Appointment = {
      ...appointment,
      id: newId,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert([appointment])
          .select()
          .single();
        if (!error && data) return data as Appointment;
      } catch (err) {
        console.error('Supabase appointment creation error:', err);
      }
    }

    const current = getStoredAppointments();
    const updated = [newAppointment, ...current];
    saveStoredAppointments(updated);
    return newAppointment;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Appointment;
      } catch (err) {
        console.error('Supabase update status error:', err);
      }
    }

    const current = getStoredAppointments();
    const index = current.findIndex(a => a.id === id);
    if (index !== -1) {
      current[index].status = status;
      saveStoredAppointments(current);
      return current[index];
    }
    return null;
  }
};
