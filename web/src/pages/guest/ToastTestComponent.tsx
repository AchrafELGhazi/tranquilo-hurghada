import React from 'react';
import { toast, Toaster } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export default function ToastTestComponent() {
    const showSuccessToast = () => {
        toast.success('Success! Operation completed successfully.', {
            description: 'Your changes have been saved.',
            duration: 4000,
        });
    };

    const showErrorToast = () => {
        toast.error('Error! Something went wrong.', {
            description: 'Please try again or contact support.',
            duration: 5000,
        });
    };

    const showWarningToast = () => {
        toast.warning('Warning! Please review your input.', {
            description: 'Some fields may need your attention.',
            duration: 4000,
        });
    };

    const showInfoToast = () => {
        toast.info("Info: Here's some helpful information.", {
            description: 'This is just a notification for your reference.',
            duration: 3000,
        });
    };

    const showCustomToast = () => {
        toast('Custom Toast', {
            description: 'This is a custom toast with an icon',
            icon: <CheckCircle className='h-4 w-4' />,
            duration: 4000,
        });
    };

    const showPromiseToast = () => {
        const promise = new Promise(resolve => {
            setTimeout(() => resolve({ name: 'John Doe' }), 2000);
        });

        toast.promise(promise, {
            loading: 'Loading user data...',
            success: data => `Welcome back, ${data.name}!`,
            error: 'Failed to load user data',
        });
    };

    return (
        <div className='min-h-screen bg-gray-50 py-12 px-4'>
            <div className='max-w-2xl mx-auto'>
                <div className='bg-white rounded-lg shadow-lg p-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Toast Notifications Test</h1>
                    <p className='text-gray-600 mb-8'>
                        Click the buttons below to test different types of toast notifications using Sonner.
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <button
                            onClick={showSuccessToast}
                            className='flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
                        >
                            <CheckCircle className='h-5 w-5' />
                            Success Toast
                        </button>

                        <button
                            onClick={showErrorToast}
                            className='flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
                        >
                            <XCircle className='h-5 w-5' />
                            Error Toast
                        </button>

                        <button
                            onClick={showWarningToast}
                            className='flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
                        >
                            <AlertTriangle className='h-5 w-5' />
                            Warning Toast
                        </button>

                        <button
                            onClick={showInfoToast}
                            className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
                        >
                            <Info className='h-5 w-5' />
                            Info Toast
                        </button>

                        <button
                            onClick={showCustomToast}
                            className='flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
                        >
                            <CheckCircle className='h-5 w-5' />
                            Custom Toast
                        </button>

                        <button
                            onClick={showPromiseToast}
                            className='flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
                        >
                            <Info className='h-5 w-5' />
                            Promise Toast
                        </button>
                    </div>

                    <div className='mt-8 p-4 bg-gray-100 rounded-lg'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Instructions:</h3>
                        <ul className='text-gray-600 space-y-1'>
                            <li>• Click any button to trigger the corresponding toast notification</li>
                            <li>• Success, Error, and Warning toasts show different styles and colors</li>
                            <li>• Each toast has a title, description, and auto-dismiss timer</li>
                            <li>• The Promise toast demonstrates loading states</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sonner Toaster - This renders the actual toasts */}
            <Toaster position='bottom-right' richColors closeButton expand={false} visibleToasts={5} />
        </div>
    );
}
