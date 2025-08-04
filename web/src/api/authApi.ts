import apiService from "@/utils/api";

export interface User {
     id: string;
     email: string;
     firstName: string;
     lastName: string;
     role: 'USER' | 'ADMIN';
     isActive: boolean;
     createdAt: string;
     updatedAt: string;
}

export interface RegisterData {
     email: string;
     password: string;
     firstName: string;
     lastName: string;
}

export interface LoginData {
     email: string;
     password: string;
}

export interface AuthResponse {
     message: string;
}

class AuthApi {
     async register(data: RegisterData): Promise<AuthResponse> {
          return apiService.post<AuthResponse>('/auth/register', data);
     }

     async login(data: LoginData): Promise<AuthResponse> {
          return apiService.post<AuthResponse>('/auth/login', data);
     }

     async logout(): Promise<AuthResponse> {
          return apiService.post<AuthResponse>('/auth/logout');
     }

     async refreshToken(): Promise<AuthResponse> {
          return apiService.post<AuthResponse>('/auth/refresh-token');
     }

     async getCurrentUser(): Promise<User> {
          return apiService.get<User>('/auth/me');
     }
}

export const authApi = new AuthApi();
export default authApi;