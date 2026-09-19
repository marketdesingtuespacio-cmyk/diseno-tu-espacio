import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole, UserPermission } from '../types';
import { activityLogService } from './activityLogService';

const LOCAL_STORAGE_PROFILES_KEY = 'luxe_team_profiles_v1';

export const DEFAULT_ADMIN: UserProfile = {
  id: 'usr-admin-1',
  full_name: 'Director General (Admin)',
  email: 'admin@disenotuespacio.com',
  role: 'admin',
  permissions: [
    'manage_products',
    'manage_orders',
    'manage_appointments',
    'manage_coupons',
    'manage_team',
    'view_analytics',
    'edit_settings'
  ],
  status: 'active',
  created_at: '2026-08-01'
};

export const DEFAULT_COLLABORATOR: UserProfile = {
  id: 'usr-collab-1',
  full_name: 'Mateo Restrepo (Interiorismo & Ventas)',
  email: 'colaborador@disenotuespacio.com',
  role: 'collaborator',
  permissions: [
    'manage_products',
    'manage_orders',
    'manage_appointments'
  ],
  status: 'active',
  created_at: '2026-08-10'
};

const getStoredProfiles = (): UserProfile[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  const initial = [DEFAULT_ADMIN, DEFAULT_COLLABORATOR];
  localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(initial));
  return initial;
};

const saveStoredProfiles = (profiles: UserProfile[]) => {
  localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
};

export const authService = {
  async getTeamMembers(): Promise<UserProfile[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (!error && data && data.length > 0) {
          return data as UserProfile[];
        }
      } catch (err) {
        console.warn('Supabase profiles fetch failed, using local dataset', err);
      }
    }
    return getStoredProfiles();
  },

  async addCollaborator(collaborator: Omit<UserProfile, 'id'>): Promise<UserProfile> {
    const newId = `usr-${Date.now()}`;
    const newProfile: UserProfile = { ...collaborator, id: newId };
    let result: UserProfile = newProfile;

    if (isSupabaseConfigured()) {
      // 1. Try Edge Function if available
      try {
        const { data, error } = await supabase.functions.invoke('invite-collaborator', {
          body: {
            email: collaborator.email,
            full_name: collaborator.full_name,
            role: collaborator.role,
            permissions: collaborator.permissions,
            status: collaborator.status
          }
        });
        
        if (!error && data && data.success && data.user) {
          result = data.user as UserProfile;
        }
      } catch (err) {
        console.warn('Edge Function "invite-collaborator" no disponible en Supabase Nube, utilizando inserción directa en tabla profiles:', err);
      }

      if (result.id === newId) {
        // 2. Direct Supabase Database insert fallback
        try {
          const { data: dbData, error: dbError } = await supabase
            .from('profiles')
            .insert([{
              id: newId,
              full_name: collaborator.full_name,
              email: collaborator.email,
              role: collaborator.role,
              permissions: collaborator.permissions,
              status: collaborator.status || 'active'
            }])
            .select();

          if (!dbError && dbData && dbData.length > 0) {
            result = dbData[0] as UserProfile;
          }
        } catch (dbErr) {
          console.warn('Error insertando en tabla profiles de Supabase:', dbErr);
        }
      }
    }

    const current = getStoredProfiles();
    const updated = [result, ...current.filter(p => p.id !== result.id)];
    saveStoredProfiles(updated);

    activityLogService.logActivity({
      entity_type: 'team',
      entity_id: result.id,
      entity_name: result.full_name,
      action: 'create',
      description: `Invitó al miembro de equipo "${result.full_name}" (${result.email})`,
      details: `Rol: ${result.role} | Estado: ${result.status}`
    });

    return result;
  },

  async updateUserRoleAndPermissions(
    id: string, 
    role: UserRole, 
    permissions: UserPermission[],
    status: 'active' | 'suspended'
  ): Promise<UserProfile | null> {
    let updatedProfile: UserProfile | null = null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ role, permissions, status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) updatedProfile = data as UserProfile;
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
      }
    }

    if (!updatedProfile) {
      const current = getStoredProfiles();
      const idx = current.findIndex(p => p.id === id);
      if (idx !== -1) {
        current[idx].role = role;
        current[idx].permissions = permissions;
        current[idx].status = status;
        saveStoredProfiles(current);
        updatedProfile = current[idx];
      }
    }

    if (updatedProfile) {
      activityLogService.logActivity({
        entity_type: 'team',
        entity_id: id,
        entity_name: updatedProfile.full_name,
        action: 'update',
        description: `Actualizó permisos y estado del colaborador "${updatedProfile.full_name}"`,
        details: `Nuevo Rol: ${role} | Estado: ${status} | Permisos: ${permissions.length}`
      });
    }

    return updatedProfile;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    const current = getStoredProfiles();
    const target = current.find(p => p.id === id);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('profiles').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting profile in Supabase:', err);
      }
    }

    const filtered = current.filter(p => p.id !== id);
    saveStoredProfiles(filtered);

    activityLogService.logActivity({
      entity_type: 'team',
      entity_id: id,
      entity_name: target?.full_name || id,
      action: 'delete',
      description: `Eliminó al usuario/colaborador "${target?.full_name || id}" (${target?.email || id})`,
      details: `ID: ${id}`
    });

    return true;
  }
};
