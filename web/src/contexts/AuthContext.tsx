import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, type LoginData, type RegisterData, type User } from '../api/authApi';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (role: 'GUEST' | 'HOST' | 'ADMIN') => boolean;
    isGuest: () => boolean;
    isHost: () => boolean;
    isAdmin: () => boolean;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!user && !!authApi.getAccessToken();

    // Initialize auth state on app start
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setIsLoading(true);

                // Check if we have stored user data and token
                const storedUser = authApi.getUserFromStorage();
                const accessToken = authApi.getAccessToken();

                if (storedUser && accessToken) {
                    try {
                        // Verify token is still valid by getting current user
                        const currentUser = await authApi.getCurrentUser();
                        setUser(currentUser);
                    } catch (error) {
                        // Token might be expired, clear everything
                        console.warn('Token validation failed, clearing auth data');
                        authApi.clearAuthData();
                        setUser(null);
                    }
                } else {
                    // No stored auth data
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                authApi.clearAuthData();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (data: LoginData): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await authApi.login(data);
            setUser(user);
        } catch (error: any) {
            const errorMessage = error.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await authApi.register(data);
            setUser(user);
        } catch (error: any) {
            const errorMessage = error.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.logout();
            setUser(null);
        } catch (error: any) {
            // Even if logout fails on server, clear local state
            console.warn('Logout error:', error);
            authApi.clearAuthData();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const hasRole = (role: 'GUEST' | 'HOST' | 'ADMIN'): boolean => {
        if (!user) return false;

        // Admin has access to everything
        if (user.role === 'ADMIN') return true;

        // Host has access to HOST and GUEST
        if (user.role === 'HOST' && (role === 'HOST' || role === 'GUEST')) return true;

        // Guest only has access to GUEST
        return user.role === role;
    };

    const isGuest = (): boolean => hasRole('GUEST');
    const isHost = (): boolean => hasRole('HOST');
    const isAdmin = (): boolean => user?.role === 'ADMIN';

    const clearError = (): void => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        hasRole,
        isGuest,
        isHost,
        isAdmin,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
