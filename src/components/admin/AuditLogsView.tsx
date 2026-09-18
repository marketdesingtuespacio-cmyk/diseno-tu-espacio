import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  RefreshCw, 
  User, 
  Package, 
  ShoppingBag, 
  Calendar, 
  Tag, 
  Users, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Download,
  Database,
  Code
} from 'lucide-react';
import { ActivityLog } from '../../types';
import { activityLogService } from '../../services/activityLogService';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [showSqlModal, setShowSqlModal] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await activityLogService.getLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    const unsub = activityLogService.subscribeToLogs(() => {
      fetchLogs();
    });
    return () => unsub();
  }, []);

  // Filtered Logs
  const filteredLogs = logs.filter(log => {
    if (selectedEntity !== 'all' && log.entity_type !== selectedEntity) return false;
    if (selectedAction !== 'all' && log.action !== selectedAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = log.entity_name?.toLowerCase().includes(q);
      const matchDesc = log.description?.toLowerCase().includes(q);
      const matchUser = log.user_name?.toLowerCase().includes(q) || log.user_email?.toLowerCase().includes(q);
      const matchDetails = log.details?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchUser && !matchDetails) return false;
    }
    return true;
  });

  // Calculate Metrics
  const todayStr = new Date().toISOString().substring(0, 10);
  const todayCount = logs.filter(l => l.created_at && l.created_at.substring(0, 10) === todayStr).length;
  const uniqueUsers = Array.from(new Set(logs.map(l => l.user_email))).length;
  const orderLogsCount = logs.filter(l => l.entity_type === 'order').length;

  const handleExportCSV = () => {
    if (logs.length === 0) return alert('No hay registros para exportar.');
    const headers = ['Fecha y Hora', 'Usuario / Cuenta', 'Email', 'Entidad', 'Referencia/Nombre', 'Acción', 'Descripción', 'Detalles'];
    const rows = filteredLogs.map(l => [
      l.created_at,
      l.user_name,
      l.user_email,
      l.entity_type,
      `"${(l.entity_name || '').replace(/"/g, '""')}"`,
      l.action,
      `"${(l.description || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bitacora_auditoria_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEntityIcon = (type: ActivityLog['entity_type']) => {
    switch (type) {
      case 'product': return <Package className="w-4 h-4 text-blue-600" />;
      case 'order': return <ShoppingBag className="w-4 h-4 text-purple-600" />;
      case 'appointment': return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'coupon': return <Tag className="w-4 h-4 text-amber-600" />;
      case 'team': return <Users className="w-4 h-4 text-indigo-600" />;
      default: return <ShieldCheck className="w-4 h-4 text-neutral-600" />;
    }
  };

  const getActionBadge = (action: ActivityLog['action']) => {
    switch (action) {
      case 'create':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <PlusCircle className="w-3 h-3 text-emerald-600" /> Creación
          </span>
        );
      case 'update':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
            <Edit3 className="w-3 h-3 text-blue-600" /> Edición
          </span>
        );
      case 'status_change':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-amber-600" /> Cambio Estado
          </span>
        );
      case 'delete':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
            <Trash2 className="w-3 h-3 text-red-600" /> Eliminación
          </span>
        );
      case 'sync':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1">
            <Database className="w-3 h-3 text-indigo-600" /> Sincronización
          </span>
        );
    }
  };

  const formatDateString = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return isoStr;
    }
  };

  const sqlCode = `-- TABLA DE AUDITORÍA Y REGISTRO DE CAMBIOS EN SUPABASE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id TEXT,
  entity_name TEXT NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITAR REALTIME EN LA TABLA
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/90 backdrop-blur-md border border-white/90 p-6 rounded-2xl shadow-xs gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-black" />
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-brand-black">
              Bitácora & Historial de Auditoría
            </h3>
          </div>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Registro cronológico en tiempo real de todas las modificaciones en Productos, Pedidos e Inventario, detallando usuario, hora y fecha.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3.5 py-2 border border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 transition-all"
            title="Ver SQL para crear la tabla de auditoría en Supabase"
          >
            <Code className="w-3.5 h-3.5 text-neutral-600" /> Esquema Supabase
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-100 text-brand-black text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-neutral-600" /> Exportar CSV
          </button>
          <button
            onClick={fetchLogs}
            className="p-2 border border-neutral-300 bg-white hover:bg-neutral-100 rounded-xl transition-all"
            title="Actualizar registro"
          >
            <RefreshCw className={`w-4 h-4 text-neutral-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Total Cambios Registrados</span>
          <span className="text-2xl font-black text-brand-black mt-1 block">{logs.length}</span>
          <span className="text-[10px] text-neutral-500 mt-1 block">Histórico en sistema</span>
        </div>

        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Modificaciones Hoy</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{todayCount}</span>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Cambios realizados hoy</span>
        </div>

        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Cuentas Activas</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{uniqueUsers}</span>
          <span className="text-[10px] text-neutral-500 mt-1 block">Usuarios registrados</span>
        </div>

        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Cambios en Pedidos</span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">{orderLogsCount}</span>
          <span className="text-[10px] text-neutral-500 mt-1 block">Modificaciones de órdenes</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 border border-neutral-200 rounded-2xl shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por usuario, correo, producto o referencia..."
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-black bg-neutral-50/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Filter Entity */}
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold bg-white text-neutral-700 focus:outline-none"
          >
            <option value="all">Todas las Entidades</option>
            <option value="product">Productos</option>
            <option value="order">Pedidos / Órdenes</option>
            <option value="appointment">Citas</option>
            <option value="coupon">Cupones</option>
            <option value="team">Equipo</option>
          </select>

          {/* Filter Action */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold bg-white text-neutral-700 focus:outline-none"
          >
            <option value="all">Todas las Acciones</option>
            <option value="create">Creaciones</option>
            <option value="update">Ediciones</option>
            <option value="status_change">Cambio de Estado</option>
            <option value="delete">Eliminaciones</option>
            <option value="sync">Sincronización</option>
          </select>

          {(searchQuery || selectedEntity !== 'all' || selectedAction !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedEntity('all');
                setSelectedAction('all');
              }}
              className="text-xs text-neutral-500 underline font-medium hover:text-black px-2"
            >
              Restablecer
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Timeline / Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Clock className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-sm font-bold text-neutral-700">No se encontraron registros de auditoría.</p>
            <p className="text-xs text-neutral-400">Los cambios que realices en productos u órdenes quedarán registrados automáticamente aquí.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-neutral-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Avatar User Icon */}
                  <div className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center shrink-0 shadow-2xs">
                    <User className="w-4 h-4 text-neutral-700" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-xs text-neutral-900">{log.user_name}</span>
                      <span className="text-[10px] text-neutral-400 font-medium">({log.user_email})</span>
                      {getActionBadge(log.action)}
                      <span className="px-2 py-0.5 rounded-md text-[9.5px] font-bold uppercase bg-neutral-100 text-neutral-700 border flex items-center gap-1">
                        {getEntityIcon(log.entity_type)} {log.entity_type}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-800 font-medium">
                      {log.description}
                    </p>

                    {log.details && (
                      <p className="text-[11px] text-neutral-500 font-mono bg-neutral-50 px-2 py-1 rounded border border-neutral-200/60 inline-block">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>

                {/* Timestamp & ID info */}
                <div className="text-left md:text-right shrink-0">
                  <span className="text-xs font-bold text-neutral-900 block flex items-center md:justify-end gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" /> {formatDateString(log.created_at)}
                  </span>
                  {log.entity_id && (
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      Ref/ID: {log.entity_id}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SQL Modal Helper */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 border border-neutral-200 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-brand-black flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" /> Crear Tabla activity_logs en Supabase
              </h4>
              <button 
                onClick={() => setShowSqlModal(false)}
                className="text-neutral-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Si deseas que el historial de auditoría se guarde de forma permanente en tu base de datos de Supabase además de este navegador, puedes copiar y ejecutar este script en el <strong>SQL Editor</strong> de Supabase:
            </p>

            <pre className="bg-neutral-900 text-emerald-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto select-all">
              {sqlCode}
            </pre>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sqlCode);
                  alert('¡Código SQL copiado al portapapeles!');
                }}
                className="bg-brand-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
              >
                Copiar Código SQL
              </button>
              <button
                onClick={() => setShowSqlModal(false)}
                className="bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-neutral-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
