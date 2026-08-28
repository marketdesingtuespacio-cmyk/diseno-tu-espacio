import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, CreditCard, ArrowRight, User, Mail, Phone, FileText } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';

const SERVICES = [
  {
    id: 'iluminacion',
    title: 'Asesoría de Iluminación Residencial',
    price: 150,
    duration: '90 min',
    description: 'Estudio técnico de puntos de luz, niveles de lux recomendados y propuesta de accesorios lumínicos según planos.'
  },
  {
    title: 'Visita de Diseño de Interiores',
    id: 'interiorismo',
    price: 250,
    duration: '120 min',
    description: 'Visita in-situ por un arquitecto senior para evaluación de espacio, paleta cromática, texturas y distribución.'
  },
  {
    title: 'Proyecto Llave en Mano VIP',
    id: 'llave-en-mano',
    price: 500,
    duration: 'Jornada Completa',
    description: 'Gestión integral desde el renderizado 3D hasta la adquisición e instalación completa de piezas de iluminación y arte.'
  }
];

const TIME_SLOTS = ['09:30', '11:00', '12:30', '15:00', '16:30', '18:00'];

export const BookingPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState('11:00');
  
  // User Details Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await appointmentService.createAppointment({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service_type: selectedService.title,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        status: 'confirmed',
        payment_status: 'paid',
        price: selectedService.price,
        notes: formData.notes
      });

      setBookingResult(created);
      setStep(3);
    } catch (err) {
      alert('Error al reservar la cita. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block">
          Servicio de Asesoría Técnica
        </span>
        <h1 className="text-3xl md:text-4xl font-light text-brand-black tracking-tight">
          Agendar Cita de Diseño & Iluminación
        </h1>
        <p className="text-xs text-neutral-500 max-w-xl mx-auto font-light leading-relaxed">
          Seleccione el tipo de servicio, elija su fecha preferida y confirme su reserva mediante pago seguro. Un arquitecto especializado atenderá su solicitud.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center items-center gap-4 mb-12 border-b border-brand-border pb-6 text-xs uppercase tracking-wider font-medium">
        <span className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-black font-bold' : 'text-neutral-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-black text-white flex items-center justify-center text-[10px]">1</span> 
          Servicio & Fecha
        </span>
        <span className="text-neutral-300">•</span>
        <span className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-black font-bold' : 'text-neutral-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-black text-white flex items-center justify-center text-[10px]">2</span> 
          Datos & Pago
        </span>
        <span className="text-neutral-300">•</span>
        <span className={`flex items-center gap-2 ${step === 3 ? 'text-brand-black font-bold' : 'text-neutral-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-black text-white flex items-center justify-center text-[10px]">3</span> 
          Confirmación
        </span>
      </div>

      {/* STEP 1: SERVICE & DATE */}
      {step === 1 && (
        <div className="space-y-10">
          
          {/* Services Selection */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4">
              1. Seleccione el Tipo de Servicio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map((srv) => (
                <div 
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`cursor-pointer p-6 border transition-luxury flex flex-col justify-between ${
                    selectedService.id === srv.id 
                      ? 'border-brand-black bg-brand-surface shadow-subtle' 
                      : 'border-brand-border hover:border-neutral-400'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-brand-black">{srv.title}</h4>
                      <span className="text-xs font-bold bg-brand-black text-white px-2 py-0.5">
                        €{srv.price}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] text-neutral-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-black" /> Duración aproximada: {srv.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-brand-border">
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 2. Elija la Fecha
              </h3>
              <input 
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 text-xs font-medium text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> 3. Horarios Disponibles
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((time) => (
                  <button 
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 px-3 text-xs font-medium border transition-colors ${
                      selectedTime === time
                        ? 'bg-brand-black text-white border-brand-black'
                        : 'bg-brand-white border-brand-border text-brand-black hover:border-neutral-400'
                    }`}
                  >
                    {time} hrs
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-6">
            <button 
              onClick={() => setStep(2)}
              className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-4 px-8 hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              Continuar a Datos del Cliente <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: USER DETAILS & PAYMENT */}
      {step === 2 && (
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* User Details */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black pb-2 border-b border-brand-border">
              Información de Contacto & Proyecto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Sofía Alarcón"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-surface border border-brand-border py-2.5 pl-10 pr-3 text-xs text-brand-black focus:outline-none focus:border-brand-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input 
                    type="email" 
                    required
                    placeholder="sofia@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-brand-surface border border-brand-border py-2.5 pl-10 pr-3 text-xs text-brand-black focus:outline-none focus:border-brand-black"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Teléfono de Contacto *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input 
                  type="tel" 
                  required
                  placeholder="+34 600 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border py-2.5 pl-10 pr-3 text-xs text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Notas del Proyecto o Dirección de Visita
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <textarea 
                  rows={3}
                  placeholder="Detalles sobre el espacio, planos o preferencias de estilo..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border py-2.5 pl-10 pr-3 text-xs text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>
            </div>

            {/* Payment Guarantee Notice */}
            <div className="bg-brand-surface p-4 border border-brand-border flex items-center gap-3 text-xs text-neutral-600">
              <CreditCard className="w-5 h-5 text-brand-black shrink-0" />
              <span>Procesamiento de reserva mediante pasarela segura Stripe. Se enviará comprobante oficial a su email.</span>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="bg-transparent border border-brand-black text-brand-black text-xs font-bold uppercase tracking-widest py-3.5 px-6 hover:bg-neutral-100"
              >
                Volver
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Procesando Pago Seguro...' : `Pagar & Confirmar Reserva (€${selectedService.price})`}
              </button>
            </div>

          </div>

          {/* Summary Box */}
          <div className="bg-brand-surface border border-brand-border p-6 h-fit space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-2">
              Resumen de Reserva
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Servicio:</span>
                <span className="font-bold text-right text-brand-black">{selectedService.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Fecha:</span>
                <span className="font-medium text-brand-black">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Hora:</span>
                <span className="font-medium text-brand-black">{selectedTime} hrs</span>
              </div>
              <div className="flex justify-between border-t border-neutral-300 pt-3 text-sm font-bold">
                <span>Total a Pagar:</span>
                <span>€{selectedService.price}</span>
              </div>
            </div>
          </div>

        </form>
      )}

      {/* STEP 3: CONFIRMATION */}
      {step === 3 && bookingResult && (
        <div className="max-w-md mx-auto bg-brand-surface border border-brand-black p-8 text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-brand-black mx-auto stroke-[1.5]" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              Reserva Confirmada
            </span>
            <h3 className="text-xl font-light text-brand-black">¡Cita Agendada con Éxito!</h3>
          </div>
          <div className="bg-white p-4 border border-brand-border text-left text-xs space-y-2 font-mono">
            <div><span className="text-neutral-400">ID Cita:</span> {bookingResult.id}</div>
            <div><span className="text-neutral-400">Cliente:</span> {bookingResult.customer_name}</div>
            <div><span className="text-neutral-400">Servicio:</span> {bookingResult.service_type}</div>
            <div><span className="text-neutral-400">Fecha/Hora:</span> {bookingResult.appointment_date} a las {bookingResult.appointment_time}</div>
            <div><span className="text-neutral-400">Estado Pago:</span> PAGADO (€{bookingResult.price})</div>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed font-light">
            Hemos enviado una confirmación de calendario a <strong>{bookingResult.customer_email}</strong>. Uno de nuestros arquitectos se pondrá en contacto previa visita.
          </p>
          <button 
            onClick={() => setStep(1)}
            className="w-full bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-3 px-4 hover:bg-neutral-800 transition-colors"
          >
            Agendar Otra Cita
          </button>
        </div>
      )}

    </div>
  );
};
