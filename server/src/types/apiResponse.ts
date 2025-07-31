// Base API Response Structure
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: ApiMeta;
  message?: string;
}

// Metadata for API responses
export interface ApiMeta {
  pagination?: PaginationMeta;
  total?: number;
  count?: number;
  filters?: Record<string, any>;
  timestamp?: string;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Error Response Structure
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    path: string;
  };
}

// Specific response types for your endpoints
export interface CategoriesResponse {
  categories: any[];
}

export interface UserResponse {
  user: any;
}

export interface AuthResponse {
  user: any;
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

// Generic list response with pagination
export interface ListResponse<T> {
  items: T[];
}

// For responses that need both data and pagination
export interface PaginatedResponse<T> {
  items: T[];
}
