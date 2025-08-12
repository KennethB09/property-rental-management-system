import React from 'react';
import { Navigate } from 'react-router';
import { useUserRole } from '../hooks/useCheckRole';
import { useAuthContext } from '@/context/AuthContext';

type UserRole = 'tenant' | 'landlord' | 'guest';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['tenant', 'landlord'],
  redirectPath = '/auth/tenant-login'
}) => {
  const { role, isLoading } = useUserRole();
  const { session } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(role) || !session) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};