import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const loginBasePath = requiredRole === 'STAFF' ? '/login/admin' : '/login/customer';

  if (!isAuthenticated) {
    const redirect = `${location.pathname}${location.search}`;
    const loginSearchParams = new URLSearchParams({ redirect });

    return <Navigate to={`${loginBasePath}?${loginSearchParams.toString()}`} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const redirect = `${location.pathname}${location.search}`;
    const loginSearchParams = new URLSearchParams({ redirect });
    return <Navigate to={`${loginBasePath}?${loginSearchParams.toString()}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
