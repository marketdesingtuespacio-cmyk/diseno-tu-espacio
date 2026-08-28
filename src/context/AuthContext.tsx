import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole, UserPermission } from '../types';
import { DEFAULT_ADMIN, DEFAULT_COLLABORATOR, authService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginAsDemoAdmin: () => void;
  loginAsDemoCollaborator: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (fullName: string, email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: UserPermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_ACTIVE_USER_KEY = 'luxe_active_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ACTIVE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_ADMIN; // Default signed-in as Admin for smooth demo experience
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ACTIVE_USER_KEY);
    }
  }, [user]);

  // Demo Login as Admin
  const loginAsDemoAdmin = () => {
    setUser(DEFAULT_ADMIN);
  };

  // Demo Login as Collaborator
  const loginAsDemoCollaborator = () => {
    setUser(DEFAULT_COLLABORATOR);
  };

  // Live Supabase Login or Demo Authentication
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          // Fetch profile from Supabase profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser(profile as UserProfile);
            return { success: true };
          }
        }
      } catch (err: any) {
        console.warn('Supabase auth failed, trying demo check', err);
      }
    }

    // Demo Authentication Check
    if (email.toLowerCase().includes('admin')) {
      setUser(DEFAULT_ADMIN);
      return { success: true };
    } else if (email.toLowerCase().includes('colaborador') || email.toLowerCase().includes('collab')) {
      setUser(DEFAULT_COLLABORATOR);
      return { success: true };
    } else {
      // Default to new logged-in user profile
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        full_name: email.split('@')[0],
        email: email,
        role: 'collaborator',
        permissions: ['manage_products', 'manage_orders', 'manage_appointments'],
        status: 'active'
      };
      setUser(newProfile);
      return { success: true };
    }
  };

  // Register New User Account
  const registerWithEmail = async (
    fullName: string, 
    email: string, 
    pass: string, 
    requestedRole: UserRole = 'collaborator'
  ): Promise<{ success: boolean; error?: string }> => {
    const defaultPermissions: UserPermission[] = requestedRole === 'admin' 
      ? ['manage_products', 'manage_orders', 'manage_appointments', 'manage_coupons', 'manage_team', 'view_analytics', 'edit_settings']
      : ['manage_products', 'manage_orders', 'manage_appointments'];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: fullName, role: requestedRole }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profilePayload = {
            id: data.user.id,
            full_name: fullName,
            email,
            role: requestedRole,
            permissions: defaultPermissions,
            status: 'active' as const
          };

          // Insert into profiles table
          await supabase.from('profiles').insert([profilePayload]);
          setUser(profilePayload);
          return { success: true };
        }
      } catch (err: any) {
        console.error('Supabase registration error:', err);
      }
    }

    // Local / Demo Account Creation Fallback
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      full_name: fullName,
      email,
      role: requestedRole,
      permissions: defaultPermissions,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0]
    };

    await authService.addCollaborator(newProfile);
    setUser(newProfile);
    return { success: true };
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut();
    }
    setUser(null);
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: UserPermission): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all permissions
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsDemoAdmin,
        loginAsDemoCollaborator,
        loginWithEmail,
        registerWithEmail,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
