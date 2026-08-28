import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole, UserPermission } from '../types';

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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('profiles').insert([newProfile]).select().single();
        if (!error && data) return data as UserProfile;
      } catch (err) {
        console.error('Error adding profile in Supabase:', err);
      }
    }

    const current = getStoredProfiles();
    const updated = [newProfile, ...current];
    saveStoredProfiles(updated);
    return newProfile;
  },

  async updateUserRoleAndPermissions(
    id: string, 
    role: UserRole, 
    permissions: UserPermission[],
    status: 'active' | 'suspended'
  ): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ role, permissions, status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as UserProfile;
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
      }
    }

    const current = getStoredProfiles();
    const idx = current.findIndex(p => p.id === id);
    if (idx !== -1) {
      current[idx].role = role;
      current[idx].permissions = permissions;
      current[idx].status = status;
      saveStoredProfiles(current);
      return current[idx];
    }
    return null;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.error('Error deleting profile in Supabase:', err);
      }
    }

    const current = getStoredProfiles();
    const filtered = current.filter(p => p.id !== id);
    saveStoredProfiles(filtered);
    return true;
  }
};
