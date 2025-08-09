import React from 'react';
import { toast, Toaster } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export const THToast = {
    success: (message: string, description?: string) => {
        toast.success(message, {
            description,
            duration: 4000,
            icon: <CheckCircle className='h-4 w-4' />,
        });
    },

    error: (message: string, description?: string) => {
        toast.error(message, {
            description,
            duration: 5000,
            icon: <XCircle className='h-4 w-4' />,
        });
    },

    warning: (message: string, description?: string) => {
        toast.warning(message, {
            description,
            duration: 4000,
            icon: <AlertTriangle className='h-4 w-4' />,
        });
    },

    info: (message: string, description?: string) => {
        toast.info(message, {
            description,
            duration: 3000,
            icon: <Info className='h-4 w-4' />,
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return toast.promise(promise, {
            loading,
            success,
            error,
        });
    },

    dismiss: () => {
        toast.dismiss();
    },
};

export const THToaster: React.FC<{
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}> = ({ position = 'bottom-right' }) => {
    return (
        <Toaster
            position={position}
            richColors
            // closeButton
            expand={false}
            visibleToasts={5}
            toastOptions={{
                style: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(248, 178, 89, 0.3)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                },
                className: 'font-medium',
            }}
        />
    );
};

export default THToaster;
