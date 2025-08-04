import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
      children: React.ReactNode;
      requireRole?: 'USER' | 'ADMIN';
      requireAdmin?: boolean;
      fallback?: React.ReactNode;
      redirectTo?: string;
}

export function ProtectedRoute({
      children,
      requireRole,
      requireAdmin = false,
      fallback,
      redirectTo = 'login',
}: ProtectedRouteProps) {
      const { isAuthenticated, hasRole, isAdmin, isLoading } = useAuth();
      const location = useLocation();
      const { lang } = useParams();

      const currentLang = lang || 'en';

      const getLocalizedPath = (path: string) => {
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            return `/${currentLang}/${cleanPath}`;
      };

      if (isLoading) {
            return fallback || <div>Loading...</div>;
      }

      if (!isAuthenticated) {
            return <Navigate to={getLocalizedPath(redirectTo)} state={{ from: location }} replace />;
      }

      if (requireAdmin && !isAdmin()) {
            return <Navigate to={getLocalizedPath('unauthorized')} replace />;
      }

      if (requireRole && !hasRole(requireRole)) {
            return <Navigate to={getLocalizedPath('unauthorized')} replace />;
      }

      return <>{children}</>;
}