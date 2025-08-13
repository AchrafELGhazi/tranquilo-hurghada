import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, type LoginData, type RegisterData } from '../api/authApi';
import apiService from '@/utils/api';
import type { User } from '@/utils/types';

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

    const getAccessToken = (): string | null => {
        return localStorage.getItem('accessToken');
    };

    const storeTokens = (accessToken: string, refreshToken: string): void => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        apiService.setAuthToken(accessToken);
    };

    const storeUser = (user: User): void => {
        localStorage.setItem('user', JSON.stringify(user));
    };

    const isAuthenticated = !!user && !!getAccessToken();

    const getRefreshToken = (): string | null => {
        return localStorage.getItem('refreshToken');
    };

    const getUserFromStorage = (): User | null => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    };

    const clearAuthData = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        apiService.clearAuthToken();
        setUser(null);
    };

    // Initialize auth on app start
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = getUserFromStorage();
                const accessToken = getAccessToken();

                if (storedUser && accessToken) {
                    // Set token in API service
                    apiService.setAuthToken(accessToken);

                    try {
                        // Verify token is still valid by fetching current user
                        const response = await authApi.getCurrentUser();
                        setUser(response.data.user);
                        storeUser(response.data.user);
                    } catch (error) {
                        console.warn('Token validation failed, clearing auth data');
                        clearAuthData();
                    }
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        const handleAuthFailure = () => {
            clearAuthData();
            setError('Your session has expired. Please log in again.');
        };

        window.addEventListener('auth:failure', handleAuthFailure);

        return () => {
            window.removeEventListener('auth:failure', handleAuthFailure);
        };
    }, []);

    const login = async (data: LoginData): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.login(data);

            if (response.success && response.data) {
                storeTokens(response.data.accessToken, response.data.refreshToken);
                storeUser(response.data.user);
                setUser(response.data.user);
            } else {
                throw new Error(response.message || 'Login failed');
            }
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
            const response = await authApi.register(data);

            if (response.success && response.data) {
                storeTokens(response.data.accessToken, response.data.refreshToken);
                storeUser(response.data.user);
                setUser(response.data.user);
            } else {
                throw new Error(response.message || 'Registration failed');
            }
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
        } catch (error: any) {
            console.warn('Server logout failed, clearing local data anyway');
        } finally {
            clearAuthData();
            setIsLoading(false);
        }
    };

    // Role checking functions
    const hasRole = (role: 'GUEST' | 'HOST' | 'ADMIN'): boolean => {
        if (!user) return false;

        if (user.role === 'ADMIN') return true;
        if (user.role === 'HOST' && (role === 'HOST' || role === 'GUEST')) return true;

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
