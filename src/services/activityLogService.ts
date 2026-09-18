import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ActivityLog } from '../types';

const LOCAL_STORAGE_LOGS_KEY = 'luxe_activity_logs_v1';
let isLogRealtimeSubscribed = false;

const getCurrentUser = () => {
  try {
    const authStored = localStorage.getItem('luxe_auth_user');
    if (authStored) {
      const parsed = JSON.parse(authStored);
      if (parsed && parsed.email) {
        return {
          email: parsed.email,
          name: parsed.full_name || parsed.email.split('@')[0],
          role: parsed.role || 'admin'
        };
      }
    }
  } catch {
    // fallback
  }

  return {
    email: 'admin@diseñotuespacio.com',
    name: 'Administrador Principal',
    role: 'admin'
  };
};

const getStoredLogs = (): ActivityLog[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return [];
};

const saveStoredLogs = (logs: ActivityLog[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs.slice(0, 500)));
  } catch (err) {
    console.warn('LocalStorage log quota warning:', err);
  }
};

export const activityLogService = {
  async getLogs(): Promise<ActivityLog[]> {
    let localLogs = getStoredLogs();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);

        if (!error && data && data.length > 0) {
          const supabaseLogs = data as ActivityLog[];
          const mergedMap = new Map<string, ActivityLog>();
          localLogs.forEach(l => mergedMap.set(l.id, l));
          supabaseLogs.forEach(l => mergedMap.set(l.id, l));
          const combined = Array.from(mergedMap.values()).sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          saveStoredLogs(combined);
          return combined;
        }
      } catch (err) {
        console.warn('Supabase fetch activity_logs warning:', err);
      }
    }

    return localLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async logActivity(payload: Omit<ActivityLog, 'id' | 'created_at' | 'user_email' | 'user_name'> & {
    user_email?: string;
    user_name?: string;
    user_role?: string;
  }): Promise<ActivityLog> {
    const activeUser = getCurrentUser();
    const nowISO = new Date().toISOString();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      entity_type: payload.entity_type,
      entity_id: payload.entity_id || '',
      entity_name: payload.entity_name,
      action: payload.action,
      description: payload.description,
      details: payload.details || '',
      user_email: payload.user_email || activeUser.email,
      user_name: payload.user_name || activeUser.name,
      user_role: payload.user_role || activeUser.role,
      created_at: nowISO
    };

    // 1. Update local storage immediately
    const current = getStoredLogs();
    const updated = [newLog, ...current];
    saveStoredLogs(updated);

    // 2. Dispatch window event for instant UI update
    window.dispatchEvent(new Event('activity_logs_updated'));

    // 3. Try to sync to Supabase activity_logs table
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('activity_logs').insert([{
          id: newLog.id,
          entity_type: newLog.entity_type,
          entity_id: newLog.entity_id,
          entity_name: newLog.entity_name,
          action: newLog.action,
          description: newLog.description,
          details: newLog.details,
          user_email: newLog.user_email,
          user_name: newLog.user_name,
          user_role: newLog.user_role,
          created_at: newLog.created_at
        }]);
      } catch (err) {
        console.warn('Supabase activity_log insert notice:', err);
      }
    }

    return newLog;
  },

  async clearLogs(): Promise<void> {
    saveStoredLogs([]);
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('activity_logs').delete().neq('id', '');
      } catch {
        // ignore
      }
    }
    window.dispatchEvent(new Event('activity_logs_updated'));
  },

  subscribeToLogs(callback: () => void): (() => void) {
    const handleEvent = () => callback();
    window.addEventListener('activity_logs_updated', handleEvent);

    if (isSupabaseConfigured() && !isLogRealtimeSubscribed) {
      isLogRealtimeSubscribed = true;
      try {
        supabase
          .channel('public_activity_logs_realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, () => {
            window.dispatchEvent(new Event('activity_logs_updated'));
          })
          .subscribe();
      } catch (err) {
        console.warn('Realtime log subscription warning:', err);
      }
    }

    return () => {
      window.removeEventListener('activity_logs_updated', handleEvent);
    };
  }
};
