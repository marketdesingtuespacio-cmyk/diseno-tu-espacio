import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ActivityLog } from '../types';

const LOCAL_STORAGE_LOGS_KEY = 'luxe_activity_logs_v1';
let isLogRealtimeSubscribed = false;

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getCurrentUser = () => {
  try {
    // 1. Primary active user session key set by AuthContext
    const activeSession = localStorage.getItem('luxe_active_user_session');
    if (activeSession) {
      const parsed = JSON.parse(activeSession);
      if (parsed && (parsed.email || parsed.full_name || parsed.name)) {
        const email = parsed.email || 'admin@disenotuespacio.com';
        const name = parsed.full_name || parsed.name || (email ? email.split('@')[0] : 'Usuario');
        const role = parsed.role || 'admin';
        return { email, name, role };
      }
    }

    // 2. Fallback check for secondary auth key
    const authStored = localStorage.getItem('luxe_auth_user');
    if (authStored) {
      const parsed = JSON.parse(authStored);
      if (parsed && (parsed.email || parsed.full_name || parsed.name)) {
        const email = parsed.email || 'admin@disenotuespacio.com';
        const name = parsed.full_name || parsed.name || (email ? email.split('@')[0] : 'Usuario');
        const role = parsed.role || 'admin';
        return { email, name, role };
      }
    }

    // 3. Fallback check for Supabase auth token
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('-auth-token')) {
        const val = localStorage.getItem(key);
        if (val) {
          const parsed = JSON.parse(val);
          const u = parsed?.user || parsed;
          if (u && u.email) {
            const email = u.email;
            const name = u.user_metadata?.full_name || u.user_metadata?.name || email.split('@')[0];
            const role = u.user_metadata?.role || 'admin';
            return { email, name, role };
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error resolviendo usuario activo para bitácora:', err);
  }

  return {
    email: 'admin@disenotuespacio.com',
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
  getCurrentUser,

  async getLogs(): Promise<ActivityLog[]> {
    let localLogs = getStoredLogs();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(300);

        if (!error && data) {
          const supabaseLogs = data as ActivityLog[];
          const mergedMap = new Map<string, ActivityLog>();
          
          // First add remote Supabase logs (source of truth)
          supabaseLogs.forEach(l => mergedMap.set(l.id, l));
          // Then merge local logs if they are not already in remote
          localLogs.forEach(l => {
            if (!mergedMap.has(l.id)) {
              mergedMap.set(l.id, l);
            }
          });

          // Auto-sync unsynced local logs to Supabase
          const remoteIds = new Set(supabaseLogs.map(s => s.id));
          const unsynced = localLogs.filter(l => !remoteIds.has(l.id));
          if (unsynced.length > 0) {
            (async () => {
              try {
                for (const item of unsynced) {
                  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
                  const payload = {
                    ...(isUUID ? { id: item.id } : { id: generateUUID() }),
                    entity_type: item.entity_type,
                    entity_id: item.entity_id || '',
                    entity_name: item.entity_name,
                    action: item.action,
                    description: item.description,
                    details: item.details || '',
                    user_email: item.user_email,
                    user_name: item.user_name,
                    user_role: item.user_role || 'admin',
                    created_at: item.created_at
                  };
                  const { error: insErr } = await supabase.from('activity_logs').insert([payload]);
                  if (insErr) {
                    const { id, ...withoutId } = payload;
                    await supabase.from('activity_logs').insert([withoutId]);
                  }
                }
              } catch {
                // Background sync fail silent
              }
            })();
          }

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
    const uuidId = generateUUID();

    const newLog: ActivityLog = {
      id: uuidId,
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
        const payloadToInsert = {
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
        };

        const { error } = await supabase.from('activity_logs').insert([payloadToInsert]);

        if (error) {
          console.warn('Supabase activity_log insert error, retrying without explicit ID:', error.message);
          const { id, ...withoutId } = payloadToInsert;
          const { data: insertedData } = await supabase.from('activity_logs').insert([withoutId]).select();
          if (insertedData && insertedData[0]?.id) {
            newLog.id = insertedData[0].id;
          }
        }
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
        await supabase.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
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
