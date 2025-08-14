import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireRole?: 'GUEST' | 'HOST' | 'ADMIN';
    requireAdmin?: boolean;
    requireHost?: boolean;
    fallback?: React.ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requireRole,
    requireAdmin = false,
    requireHost = false,
    fallback,
    redirectTo = 'signin',
}: ProtectedRouteProps) {
    const { isAuthenticated, hasRole, isAdmin, isHost, isLoading } = useAuth();
    const location = useLocation();
    const { lang } = useParams();

    // Debounce the auth state to prevent rapid re-renders
    const debouncedAuth = useDebounce({ isAuthenticated, isLoading }, 100);

    const currentLang = lang;

    const getLocalizedPath = (path: string) => {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `/${currentLang}/${cleanPath}`;
    };

    // Show loading state
    if (debouncedAuth.isLoading) {
        return (
            fallback || (
                <div className='flex items-center justify-center min-h-screen'>
                    <div className='text-lg'>Loading...</div>
                </div>
            )
        );
    }

    // Check authentication
    if (!debouncedAuth.isAuthenticated) {
        // Don't redirect if already on login/register page
        if (location.pathname.includes('/signin') || location.pathname.includes('/register')) {
            return <>{children}</>;
        }
        return <Navigate to={getLocalizedPath(redirectTo)} state={{ from: location }} replace />;
    }

    // Check admin role
    if (requireAdmin && !isAdmin()) {
        return <Navigate to={getLocalizedPath('unauthorized')} replace />;
    }

    // Check host role
    if (requireHost && !isHost()) {
        return <Navigate to={getLocalizedPath('unauthorized')} replace />;
    }

    // Check specific role
    if (requireRole && !hasRole(requireRole)) {
        return <Navigate to={getLocalizedPath('unauthorized')} replace />;
    }

    return <>{children}</>;
}

// Convenience components for common use cases
export function GuestRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requireRole'>) {
    return (
        <ProtectedRoute requireRole='GUEST' {...props}>
            {children}
        </ProtectedRoute>
    );
}

export function HostRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requireHost'>) {
    return (
        <ProtectedRoute requireHost {...props}>
            {children}
        </ProtectedRoute>
    );
}

export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requireAdmin'>) {
    return (
        <ProtectedRoute requireAdmin {...props}>
            {children}
        </ProtectedRoute>
    );
}
