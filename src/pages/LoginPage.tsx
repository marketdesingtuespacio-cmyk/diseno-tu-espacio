import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, Users, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('collaborator');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithEmail, registerWithEmail, loginAsDemoAdmin, loginAsDemoCollaborator } = useAuth();
  const navigate = useNavigate();

  // Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const result = await loginWithEmail(loginEmail, loginPassword);
    setIsLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setErrorMsg(result.error || 'Credenciales no válidas.');
    }
  };

  // Registration Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await registerWithEmail(
      registerFullName.trim(), 
      registerEmail.trim(), 
      registerPassword, 
      registerRole
    );
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg('¡Cuenta registrada y conectada exitosamente!');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } else {
      setErrorMsg(result.error || 'Error al registrar la cuenta.');
    }
  };

  const handleQuickAdmin = () => {
    loginAsDemoAdmin();
    navigate('/admin');
  };

  const handleQuickCollaborator = () => {
    loginAsDemoCollaborator();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-6 bg-white p-8 border border-brand-black shadow-elevated">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-black uppercase font-bold mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a la Tienda
          </Link>
          
          <h1 className="text-2xl font-light text-brand-black tracking-tight uppercase">
            Diseño Tu Espacio
          </h1>
          
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 block">
            Portal de Autenticación & Registro de Cuentas
          </span>
        </div>

        {/* Tab Selector: Login vs Register */}
        <div className="flex border-b border-brand-border text-xs">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'login' 
                ? 'border-brand-black text-brand-black bg-brand-surface/50' 
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Iniciar Sesión
          </button>
          
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'register' 
                ? 'border-brand-black text-brand-black bg-brand-surface/50' 
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Crear Cuenta
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs text-center font-bold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-900 text-white p-3 text-xs text-center font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: INICIAR SESIÓN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Correo Electrónico *</label>
              <input 
                type="email" 
                required
                placeholder="admin@disenotuespacio.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Contraseña *</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-4 px-6 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Iniciando Sesión...' : 'Entrar al Portal'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: CREAR CUENTA NUEVA */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Nombre Completo *</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Sofía Alarcón"
                value={registerFullName}
                onChange={(e) => setRegisterFullName(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Correo Electrónico *</label>
              <input 
                type="email" 
                required
                placeholder="sofia@disenotuespacio.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Contraseña *</label>
              <input 
                type="password" 
                required
                minLength={6}
                placeholder="•••••••• (mínimo 6 caracteres)"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-medium text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div>
              <label className="block uppercase font-bold text-neutral-500 mb-1">Seleccione Rol de Cuenta</label>
              <select 
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value as UserRole)}
                className="w-full bg-brand-surface border border-brand-border p-3 font-bold text-brand-black focus:outline-none focus:border-brand-black"
              >
                <option value="collaborator">Colaborador (Ventas / Inventario)</option>
                <option value="admin">Administrador (Acceso Total)</option>
                <option value="customer">Cliente Registrado</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-4 px-6 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Registrando Cuenta en Supabase...' : 'Crear & Conectar Cuenta'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Access Demo Buttons (Admin vs Collaborator) */}
        <div className="pt-6 border-t border-brand-border space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block text-center">
            Accesos Rápidos de Prueba (Demostración de Roles)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleQuickAdmin}
              className="p-3 border border-brand-black bg-brand-black text-white text-left hover:bg-neutral-800 transition-colors space-y-1"
            >
              <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Administrador</span>
              </div>
              <p className="text-[9px] text-neutral-300 font-light leading-tight">
                Control total, permisos de equipo y configuración.
              </p>
            </button>

            <button
              onClick={handleQuickCollaborator}
              className="p-3 border border-neutral-300 bg-brand-surface text-brand-black text-left hover:border-black transition-colors space-y-1"
            >
              <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase">
                <Users className="w-4 h-4 text-neutral-600" />
                <span>Colaborador</span>
              </div>
              <p className="text-[9px] text-neutral-500 font-light leading-tight">
                Gestión de catálogo, productos y pedidos.
              </p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
