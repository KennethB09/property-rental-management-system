import React from 'react';
import { Navigate } from 'react-router';
import { useUserRole } from '../hooks/useCheckRole';

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

  // Show loading state while checking role
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(role)) {
    // Redirect to login or appropriate page
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if role is allowed
  return <>{children}</>;
};