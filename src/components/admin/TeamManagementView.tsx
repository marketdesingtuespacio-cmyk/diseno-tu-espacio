import React, { useEffect, useState } from 'react';
import { UserProfile, UserRole, UserPermission } from '../../types';
import { authService } from '../../services/authService';
import { Users, UserPlus, Check, X, Trash2 } from 'lucide-react';

const ALL_PERMISSIONS: { id: UserPermission; label: string }[] = [
  { id: 'manage_products', label: 'Registrar & Modificar Productos' },
  { id: 'manage_orders', label: 'Gestionar Estados de Pedidos' },
  { id: 'manage_appointments', label: 'Administrar Citas de Interiorismo' },
  { id: 'manage_coupons', label: 'Crear & Activar Cupones' },
  { id: 'manage_team', label: 'Administrar Permisos de Equipo' },
  { id: 'view_analytics', label: 'Ver Reportes & Analíticas de Ventas' }
];

export const TeamManagementView: React.FC = () => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    full_name: '',
    email: '',
    role: 'collaborator' as UserRole,
    permissions: ['manage_products', 'manage_orders', 'manage_appointments'] as UserPermission[],
    status: 'active' as 'active' | 'suspended'
  });

  const loadMembers = async () => {
    const list = await authService.getTeamMembers();
    setMembers(list);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.full_name || !newMemberForm.email) return alert('Ingrese nombre y correo.');
    await authService.addCollaborator(newMemberForm);
    setIsModalOpen(false);
    setNewMemberForm({
      full_name: '',
      email: '',
      role: 'collaborator',
      permissions: ['manage_products', 'manage_orders', 'manage_appointments'],
      status: 'active'
    });
    loadMembers();
  };

  const handleTogglePermission = async (member: UserProfile, perm: UserPermission) => {
    const hasPerm = member.permissions.includes(perm);
    const newPerms = hasPerm 
      ? member.permissions.filter(p => p !== perm) 
      : [...member.permissions, perm];

    await authService.updateUserRoleAndPermissions(member.id, member.role, newPerms, member.status);
    loadMembers();
  };

  const handleChangeRole = async (member: UserProfile, newRole: UserRole) => {
    const newPerms: UserPermission[] = newRole === 'admin' 
      ? ALL_PERMISSIONS.map(p => p.id) 
      : ['manage_products', 'manage_orders'];
    await authService.updateUserRoleAndPermissions(member.id, newRole, newPerms, member.status);
    loadMembers();
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('¿Está seguro de eliminar a este miembro del equipo?')) {
      await authService.deleteTeamMember(id);
      loadMembers();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white p-6 border border-brand-border shadow-subtle">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Gestión de Personal & Roles
          </span>
          <h2 className="text-xl font-light text-brand-black flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-black" /> Control de Administradores & Colaboradores
          </h2>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-3 px-6 hover:bg-neutral-800 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Registrar Colaborador
        </button>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white border border-brand-border p-6 space-y-4 shadow-subtle">
            
            <div className="flex justify-between items-start border-b border-brand-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-brand-black">{member.full_name}</h3>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    member.role === 'admin' ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-800'
                  }`}>
                    {member.role === 'admin' ? '👑 Administrador' : '🤝 Colaborador'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{member.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <select 
                  value={member.role}
                  onChange={(e) => handleChangeRole(member, e.target.value as UserRole)}
                  className="bg-brand-surface border border-brand-border text-xs font-bold p-1.5 focus:outline-none"
                >
                  <option value="collaborator">Rol: Colaborador</option>
                  <option value="admin">Rol: Administrador</option>
                </select>

                <button 
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-neutral-400 hover:text-red-600 p-1"
                  title="Eliminar miembro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Matrix of Fine-Grained Permissions */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Matriz de Permisos Asignados
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {ALL_PERMISSIONS.map((perm) => {
                  const hasIt = member.role === 'admin' || member.permissions.includes(perm.id);
                  return (
                    <button
                      key={perm.id}
                      disabled={member.role === 'admin'}
                      onClick={() => handleTogglePermission(member, perm.id)}
                      className={`p-2.5 text-[11px] text-left border flex items-center justify-between transition-colors ${
                        hasIt 
                          ? 'bg-brand-surface border-brand-black font-bold text-brand-black' 
                          : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-400'
                      }`}
                    >
                      <span>{perm.label}</span>
                      {hasIt ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-neutral-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add New Collaborator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-6 border border-brand-black shadow-modal space-y-4 font-sans">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-2">
              Registrar Nuevo Miembro del Equipo
            </h3>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Ana María Torres"
                  value={newMemberForm.full_name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, full_name: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 text-brand-black font-medium"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Correo Electrónico *</label>
                <input 
                  type="email" 
                  required
                  placeholder="ana@disenotuespacio.com"
                  value={newMemberForm.email}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 text-brand-black font-medium"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Rol en la Empresa</label>
                <select 
                  value={newMemberForm.role}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value as UserRole })}
                  className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                >
                  <option value="collaborator">Colaborador (Ventas / Inventario)</option>
                  <option value="admin">Administrador (Acceso Total)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-brand-border uppercase font-bold text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-brand-black text-white uppercase font-bold text-xs hover:bg-neutral-800"
                >
                  Registrar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
