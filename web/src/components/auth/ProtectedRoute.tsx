import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';

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
    redirectTo = '',
}: ProtectedRouteProps) {
    const { isAuthenticated, hasRole, isAdmin, isLoading } = useAuth();
    const location = useLocation();
    const { lang } = useParams();

    // Debounce the auth state to prevent rapid re-renders
    const debouncedAuth = useDebounce({ isAuthenticated, isLoading }, 300);

    const currentLang = lang || 'en';

    const getLocalizedPath = (path: string) => {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `/${currentLang}/${cleanPath}`;
    };

    // In ProtectedRoute.tsx
    if (!debouncedAuth.isAuthenticated) {
        // Don't redirect to login if we're already on a login page
        if (!location.pathname.includes('/login')) {
            return <Navigate to={getLocalizedPath(redirectTo || 'login')} state={{ from: location }} replace />;
        }
        return null; // Stay on login page
    }
    
    if (debouncedAuth.isLoading) {
        return fallback || <div>Loading...</div>;
    }

    if (!debouncedAuth.isAuthenticated) {
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