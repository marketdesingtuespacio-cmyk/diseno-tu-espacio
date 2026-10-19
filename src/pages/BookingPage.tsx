import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MapPin, 
  Building, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { boldPaymentService } from '../services/boldPaymentService';
import { useCurrency } from '../context/CurrencyContext';
import { Appointment } from '../types';

const SERVICES = [
  {
    id: 'iluminacion',
    title: 'Asesoría de Iluminación Residencial',
    price: 150000,
    duration: '90 min',
    badge: 'Técnica & Lumínica',
    description: 'Estudio técnico de puntos de luz, niveles de lux recomendados y propuesta de lámparas y accesorios lumínicos según planos o fotos.'
  },
  {
    id: 'interiorismo',
    title: 'Visita de Diseño de Interiores In-Situ',
    price: 250000,
    duration: '120 min',
    badge: 'Más Solicitada',
    description: 'Visita presencial por un arquitecto/diseñador senior para evaluación del espacio, medidas, paleta cromática, texturas y distribución.'
  },
  {
    id: 'llave-en-mano',
    title: 'Proyecto Llave en Mano VIP',
    price: 500000,
    duration: 'Jornada Completa',
    badge: 'Integral & 3D',
    description: 'Gestión integral desde el levantamiento, renderizado 3D y especificación directa de mobiliario, iluminación, arte y acabados.'
  }
];

const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

export const BookingPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');
  const urlAppId = searchParams.get('app_id');

  const [selectedService, setSelectedService] = useState(SERVICES[1]); // Default a Visita de Interiorismo
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // User Details & Location Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Bogotá D.C.',
    address: '',
    notes: ''
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boldLaunched, setBoldLaunched] = useState(false);
  const [activeBoldAppointment, setActiveBoldAppointment] = useState<Appointment | null>(null);
  const [bookingResult, setBookingResult] = useState<Appointment | null>(null);

  // 1. Detectar si el usuario regresa de Bold con pago exitoso
  useEffect(() => {
    if (urlStatus === 'success' && urlAppId) {
      appointmentService.updateAppointmentPayment(urlAppId, 'paid', 'confirmed').then((updated) => {
        if (updated) {
          setBookingResult(updated);
        } else {
          appointmentService.getAppointmentById(urlAppId).then((app) => {
            if (app) setBookingResult(app);
          });
        }
        setStep(3);
      });
    }
  }, [urlStatus, urlAppId]);

  // 2. Consultar horarios ocupados en la fecha seleccionada para evitar choque de citas
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      appointmentService.getBookedSlots(selectedDate).then((occupied) => {
        setBookedSlots(occupied);
        // Si el horario seleccionado actualmente ya está ocupado, seleccionar el primer horario libre
        if (occupied.includes(selectedTime)) {
          const firstFree = TIME_SLOTS.find(t => !occupied.includes(t));
          if (firstFree) setSelectedTime(firstFree);
        }
        setLoadingSlots(false);
      });
    }
  }, [selectedDate]);

  // 3. Montar y disparar el botón oficial de Bold cuando el contenedor esté disponible en el DOM
  useEffect(() => {
    if (boldLaunched && activeBoldAppointment) {
      boldPaymentService.launchCheckout({
        orderId: activeBoldAppointment.id,
        amount: activeBoldAppointment.price,
        description: `Visita ${activeBoldAppointment.service_type} - ${activeBoldAppointment.customer_name}`,
        customerEmail: activeBoldAppointment.customer_email,
        customerName: activeBoldAppointment.customer_name,
        customerPhone: activeBoldAppointment.customer_phone,
        redirectionUrl: `${window.location.origin}/booking?status=success&app_id=${activeBoldAppointment.id}`
      });
    }
  }, [boldLaunched, activeBoldAppointment]);

  // Iniciar proceso de agendamiento y pago con Bold
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Por favor complete todos los datos de contacto obligatorios.');
      return;
    }

    if (!formData.address.trim()) {
      alert('Por favor indique la dirección exacta donde se realizará la visita técnica.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Registrar cita en Supabase en estado 'pending' y 'unpaid'
      const created = await appointmentService.createAppointment({
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        service_type: selectedService.title,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        city: formData.city,
        address: formData.address.trim(),
        payment_gateway: 'Bold Payments (Colombia)',
        status: 'pending',
        payment_status: 'unpaid',
        price: selectedService.price,
        notes: formData.notes.trim()
      });

      setActiveBoldAppointment(created);
      setBoldLaunched(true);
    } catch (err: any) {
      console.error('Error al iniciar pago con Bold:', err);
      alert('Ocurrió un error al preparar la pasarela de pagos. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pantalla intermedia de espera cuando Bold se está conectando
  if (boldLaunched && activeBoldAppointment) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center font-sans space-y-6">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              Pasarela Bold Colombia
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-neutral-900">
              Conectando con Pago Seguro de Bold...
            </h2>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-md mx-auto">
            Tu reserva ha sido reservada en el sistema. Presiona el botón a continuación para pagar con Tarjetas de Crédito, Débito, PSE o Nequi:
          </p>

          <div id="bold-button-container" className="pt-4 flex justify-center min-h-[60px]" />

          <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Monto a Liquidar:</span>
            <span className="font-extrabold text-neutral-900 text-sm">{formatPrice(activeBoldAppointment.price)}</span>
          </div>

          <button 
            onClick={() => setBoldLaunched(false)}
            className="text-xs text-neutral-400 hover:text-black uppercase font-bold tracking-wider pt-2 block mx-auto cursor-pointer"
          >
            ← Volver y Modificar Reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 font-sans">
      
      {/* Editorial Header */}
      <div className="text-center space-y-3 mb-10 sm:mb-12">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 block">
          Estudio de Arquitectura & Interiorismo
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 tracking-tight">
          Agendar Visita de Diseño & Asesoría
        </h1>
        <p className="text-xs text-neutral-500 max-w-xl mx-auto font-light leading-relaxed">
          Reserva una visita presencial con nuestro equipo de arquitectos. Elige tu fecha, indica la ubicación de tu proyecto y confirma mediante la pasarela segura de Bold.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-10 sm:mb-12 border-b border-neutral-200 pb-5 text-xs uppercase tracking-wider font-semibold">
        <span className={`flex items-center gap-2 ${step >= 1 ? 'text-neutral-950 font-bold' : 'text-neutral-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-neutral-950 text-white' : 'bg-neutral-200 text-neutral-500'}`}>1</span> 
          Servicio & Fecha
        </span>
        <span className="text-neutral-300">•</span>
        <span className={`flex items-center gap-2 ${step >= 2 ? 'text-neutral-950 font-bold' : 'text-neutral-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-neutral-950 text-white' : 'bg-neutral-200 text-neutral-500'}`}>2</span> 
          Ubicación & Pago Bold
        </span>
        <span className="text-neutral-300">•</span>
        <span className={`flex items-center gap-2 ${step === 3 ? 'text-neutral-950 font-bold' : 'text-neutral-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-500'}`}>3</span> 
          Confirmación
        </span>
      </div>

      {/* STEP 1: SERVICE, DATE & TIME SELECTION */}
      {step === 1 && (
        <div className="space-y-10 animate-fadeIn">
          
          {/* Services Selection */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-700" /> 1. Seleccione el Tipo de Servicio
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {SERVICES.map((srv) => (
                <div 
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col justify-between relative bg-white ${
                    selectedService.id === srv.id 
                      ? 'border-neutral-950 ring-2 ring-neutral-950 shadow-md' 
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {srv.badge && (
                    <span className="absolute -top-2.5 right-4 bg-neutral-900 text-white text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {srv.badge}
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-neutral-900">{srv.title}</h4>
                      <span className="text-xs font-extrabold bg-neutral-100 text-neutral-900 px-2 py-1 rounded-md shrink-0">
                        {formatPrice(srv.price)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-neutral-700" /> {srv.duration}
                    </span>
                    <span className="text-neutral-400 font-mono text-[10px]">COP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time Selection with Live Double-Booking Prevention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-6 border-t border-neutral-200">
            
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-700" /> 2. Elija la Fecha de la Visita
              </h3>
              <p className="text-[11px] text-neutral-500">
                Atendemos visitas de lunes a sábado en jornada continua.
              </p>
              <input 
                type="date"
                value={selectedDate}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Mínimo a partir de mañana
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-black cursor-pointer shadow-2xs"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-700" /> 3. Horarios Disponibles
                </h3>
                {loadingSlots && (
                  <span className="text-[10px] text-neutral-400 animate-pulse font-mono">Verificando agenda...</span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">
                Los horarios ocupados se bloquean automáticamente en tiempo real.
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {TIME_SLOTS.map((time) => {
                  const isOccupied = bookedSlots.includes(time);
                  return (
                    <button 
                      key={time}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 text-xs font-bold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isOccupied 
                          ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60' 
                          : selectedTime === time
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white border-neutral-300 text-neutral-800 hover:border-black'
                      }`}
                    >
                      <span>{time} hrs</span>
                      <span className="text-[9px] font-mono font-normal opacity-80">
                        {isOccupied ? 'Ocupado' : 'Disponible'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Forward Button */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={() => setStep(2)}
              className="bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest py-4 px-8 rounded-xl hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10 cursor-pointer"
            >
              <span>Continuar a Ubicación & Pago</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: USER DETAILS, VISIT ADDRESS & BOLD CHECKOUT */}
      {step === 2 && (
        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fadeIn">
          
          {/* User Details & Exact Visit Address */}
          <div className="md:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 pb-3 border-b border-neutral-100 flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-700" /> Información del Cliente & Dirección de la Visita
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Carolina Gómez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-10 pr-3 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input 
                    type="email" 
                    required
                    placeholder="carolina@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-10 pr-3 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input 
                    type="tel" 
                    required
                    placeholder="+57 311 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-10 pr-3 text-xs text-neutral-900 focus:outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Ciudad de la Visita *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <select 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-10 pr-3 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                    <option value="Chía / Cajicá / Sabana">Chía / Cajicá / Sabana</option>
                    <option value="Medellín">Medellín & Valle de Aburrá</option>
                    <option value="Cali">Cali</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Bucaramanga">Bucaramanga</option>
                    <option value="Otra Ciudad (Consultar)">Otra Ciudad (Consultar viáticos)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Dirección Exacta del Proyecto o Residencia *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Calle 127 # 15-30, Apto 502, Edificio Santa Bárbara"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-10 pr-3 text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Detalles Adicionales del Proyecto o Planos (Opcional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <textarea 
                  rows={2}
                  placeholder="Ej. Remodelación de sala y comedor, techos de doble altura, requerimos puntos de luz cálida..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-10 pr-3 text-xs text-neutral-900 focus:outline-none focus:border-black leading-relaxed"
                />
              </div>
            </div>

            {/* Pasarela Bold Security Callout */}
            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/80 flex items-start gap-3 text-xs text-neutral-700">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900 font-bold mb-0.5">Pagos Procesados con Pasarela Oficial Bold</strong>
                <span>Aceptamos Tarjetas de Crédito (Visa, Mastercard, Amex), Tarjetas Débito, cuentas PSE y Nequi con confirmación bancaria inmediata.</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="bg-transparent border border-neutral-300 rounded-xl text-neutral-800 text-xs font-bold uppercase tracking-wider py-3.5 px-6 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Volver
              </button>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Iniciando Bold...' : `Pagar con Bold (${formatPrice(selectedService.price)})`}</span>
              </button>
            </div>

          </div>

          {/* Right Summary Sidebar */}
          <div className="md:col-span-5 bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-3">
              Resumen de la Cita
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Servicio Seleccionado</span>
                <p className="font-extrabold text-neutral-900">{selectedService.title}</p>
                <p className="text-[11px] text-neutral-500">Duración: {selectedService.duration}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Fecha</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{selectedDate}</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Horario</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{selectedTime} hrs</p>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Destino</span>
                <p className="font-bold text-neutral-900 mt-0.5">{formData.city}</p>
                {formData.address && (
                  <p className="text-[11px] text-neutral-600 truncate mt-0.5">{formData.address}</p>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-bold text-neutral-700">Total a Pagar (COP):</span>
                <span className="text-xl font-black text-neutral-900">{formatPrice(selectedService.price)}</span>
              </div>
            </div>

            <div className="text-[10.5px] text-neutral-400 space-y-1">
              <p>• El valor pagado se abona al proyecto en caso de contratar la obra o mobiliario.</p>
              <p>• Se emitirá factura y comprobante oficial a tu correo.</p>
            </div>
          </div>

        </form>
      )}

      {/* STEP 3: CONFIRMATION & GOOGLE CALENDAR SYNC */}
      {step === 3 && bookingResult && (
        <div className="max-w-2xl mx-auto bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-xl animate-fadeIn">
          
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10 stroke-[1.8]" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700 block mb-1">
              ¡Pago Aprobado & Reserva Confirmada!
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
              Cita de Asesoría Agendada con Éxito
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Hemos registrado tu visita en la agenda de nuestros arquitectos y en Google Calendar.
            </p>
          </div>

          {/* Ticket Breakdown Card */}
          <div className="bg-[#FAF9F6] p-5 sm:p-6 rounded-2xl border border-neutral-200 text-left text-xs space-y-3 font-sans">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-2.5">
              <span className="text-neutral-400 font-mono text-[11px]">ID de Cita:</span>
              <span className="font-mono font-bold text-neutral-900">{bookingResult.id}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Cliente</span>
                <p className="font-bold text-neutral-900">{bookingResult.customer_name}</p>
                <p className="text-[11px] text-neutral-500">{bookingResult.customer_phone}</p>
              </div>

              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Servicio</span>
                <p className="font-bold text-neutral-900">{bookingResult.service_type}</p>
              </div>

              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Fecha & Hora</span>
                <p className="font-extrabold text-neutral-900">{bookingResult.appointment_date} a las {bookingResult.appointment_time}</p>
              </div>

              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Estado del Pago</span>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase border border-emerald-300">
                  ✓ Pagado ({formatPrice(bookingResult.price)})
                </span>
              </div>
            </div>

            {bookingResult.notes && (
              <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-600">
                <strong>Ubicación / Notas:</strong> {bookingResult.notes}
              </div>
            )}
          </div>

          {/* Action Buttons: Add to Google Calendar & WhatsApp Chat */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            
            {/* Direct Google Calendar Button */}
            <a 
              href={appointmentService.generateGoogleCalendarUrl(bookingResult)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Añadir a Google Calendar</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* WhatsApp Direct Chat with Architect */}
            <a 
              href={`https://wa.me/573113477785?text=${encodeURIComponent(
                `Hola Diseño Tu Espacio, acabo de pagar y confirmar mi cita de "${bookingResult.service_type}" para el ${bookingResult.appointment_date} a las ${bookingResult.appointment_time} (ID: ${bookingResult.id}). Deseo compartirles los planos y ubicación exacta.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Enviar Ubicación por WhatsApp</span>
            </a>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-between items-center text-xs">
            <button 
              onClick={() => {
                setBookingResult(null);
                setStep(1);
              }}
              className="text-neutral-500 hover:text-black font-semibold cursor-pointer"
            >
              Agendar Otra Cita
            </button>

            <Link 
              to="/catalog"
              className="text-neutral-900 font-bold hover:underline"
            >
              Ir a la Tienda de Muebles & Iluminación →
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};
