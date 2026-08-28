import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'collaborator'] 
}) => {
  const { user, isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-light text-brand-black">Acceso Restringido</h2>
        <p className="text-xs text-neutral-500">
          Su rol actual (<strong>{user.role}</strong>) no posee permisos para acceder a esta área de administración.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
