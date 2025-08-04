import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, type LoginData, type RegisterData, type User } from '../api/authApi';

interface AuthContextType {
      user: User | null;
      isAuthenticated: boolean;
      isLoading: boolean;
      login: (data: LoginData) => Promise<void>;
      register: (data: RegisterData) => Promise<void>;
      logout: () => Promise<void>;
      refreshToken: () => Promise<void>;
      hasRole: (role: 'USER' | 'ADMIN') => boolean;
      isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
      children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
      const [user, setUser] = useState<User | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      const isAuthenticated = !!user;

      // Initialize auth state on app startup
      useEffect(() => {
            const initializeAuth = async () => {
                  try {
                        setIsLoading(true);
                        const user = await authApi.getCurrentUser();
                        setUser(user);
                  } catch (error) {
                        console.error('Auth initialization failed:', error);
                        setUser(null);
                  } finally {
                        setIsLoading(false);
                  }
            };

            initializeAuth();
      }, []);

      const login = async (data: LoginData): Promise<void> => {
            setIsLoading(true);
            try {
                  await authApi.login(data);
                  const user = await authApi.getCurrentUser();
                  setUser(user);
            } finally {
                  setIsLoading(false);
            }
      };

      const register = async (data: RegisterData): Promise<void> => {
            setIsLoading(true);
            try {
                  await authApi.register(data);
                  const user = await authApi.getCurrentUser();
                  setUser(user);
            } finally {
                  setIsLoading(false);
            }
      };

      const logout = async (): Promise<void> => {
            setIsLoading(true);
            try {
                  await authApi.logout();
            } finally {
                  setUser(null);
                  setIsLoading(false);
            }
      };

      const refreshToken = async (): Promise<void> => {
            await authApi.refreshToken();
      };

      const hasRole = (role: 'USER' | 'ADMIN'): boolean => {
            return user?.role === role;
      };

      const isAdmin = (): boolean => {
            return user?.role === 'ADMIN';
      };

      const value: AuthContextType = {
            user,
            isAuthenticated,
            isLoading,
            login,
            register,
            logout,
            refreshToken,
            hasRole,
            isAdmin,
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
