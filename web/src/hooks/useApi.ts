import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
     data: T | null;
     loading: boolean;
     error: string | null;
}

interface UseApiOptions {
     immediate?: boolean;
     onSuccess?: (data: any) => void;
     onError?: (error: string) => void;
}

export function useApi<T>(
     apiCall: () => Promise<T>,
     options: UseApiOptions = {}
) {
     const { immediate = true, onSuccess, onError } = options;

     const [state, setState] = useState<UseApiState<T>>({
          data: null,
          loading: false,
          error: null,
     });

     const execute = useCallback(async () => {
          setState(prev => ({ ...prev, loading: true, error: null }));

          try {
               const result = await apiCall();
               setState({ data: result, loading: false, error: null });
               onSuccess?.(result);
               return result;
          } catch (error: any) {
               const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
               setState(prev => ({ ...prev, loading: false, error: errorMessage }));
               onError?.(errorMessage);
               throw error;
          }
     }, [apiCall, onSuccess, onError]);

     const reset = useCallback(() => {
          setState({ data: null, loading: false, error: null });
     }, []);

     useEffect(() => {
          if (immediate) {
               execute();
          }
     }, [execute, immediate]);

     return {
          ...state,
          execute,
          reset,
          refetch: execute,
     };
}

export function useMutation<T, TVariables = any>(
     mutationFn: (variables: TVariables) => Promise<T>,
     options: UseApiOptions = {}
) {
     const { onSuccess, onError } = options;

     const [state, setState] = useState<UseApiState<T>>({
          data: null,
          loading: false,
          error: null,
     });

     const mutate = useCallback(async (variables: TVariables) => {
          setState(prev => ({ ...prev, loading: true, error: null }));

          try {
               const result = await mutationFn(variables);
               setState({ data: result, loading: false, error: null });
               onSuccess?.(result);
               return result;
          } catch (error: any) {
               const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
               setState(prev => ({ ...prev, loading: false, error: errorMessage }));
               onError?.(errorMessage);
               throw error;
          }
     }, [mutationFn, onSuccess, onError]);

     const reset = useCallback(() => {
          setState({ data: null, loading: false, error: null });
     }, []);

     return {
          ...state,
          mutate,
          reset,
     };
}

// Example usage:
/*
// For GET requests
const { data, loading, error, refetch } = useApi(
  () => apiService.get<User[]>('/users'),
  {
    onSuccess: (users) => console.log('Users loaded:', users),
    onError: (error) => console.error('Failed to load users:', error)
  }
);

// For mutations (POST/PUT/DELETE)
const { mutate: createUser, loading: creating } = useMutation(
  (userData: CreateUserData) => apiService.post<User>('/users', userData),
  {
    onSuccess: (user) => console.log('User created:', user),
    onError: (error) => console.error('Failed to create user:', error)
  }
);

// Usage: createUser({ name: 'John', email: 'john@example.com' });
*/