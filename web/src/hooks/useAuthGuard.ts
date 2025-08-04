import { useAuth } from '../contexts/AuthContext';

export function useRequireRole(role: 'USER' | 'ADMIN') {
     const { hasRole, isAuthenticated, isLoading } = useAuth();

     return {
          hasAccess: isAuthenticated && hasRole(role),
          isLoading,
          isAuthenticated,
     };
}

export function useRequireAuth() {
     const { isAuthenticated, isLoading, user } = useAuth();

     return {
          isAuthenticated,
          isLoading,
          user,
          hasAccess: isAuthenticated,
     };
}

export function useRequireAdmin() {
     const { isAdmin, isAuthenticated, isLoading } = useAuth();

     return {
          hasAccess: isAuthenticated && isAdmin(),
          isLoading,
          isAuthenticated,
          isAdmin: isAdmin(),
     };
}

// Usage examples:
// const { hasAccess, isLoading } = useRequireRole('ADMIN');
// const { hasAccess } = useRequireAuth();
// const { hasAccess, isAdmin } = useRequireAdmin();