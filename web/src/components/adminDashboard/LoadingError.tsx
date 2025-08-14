import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const LoadingCard: React.FC = () => (
    <div className='animate-pulse'>
        <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl h-32 w-full'></div>
    </div>
);

interface ErrorMessageProps {
    message: string;
    onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
    <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200/60 rounded-2xl p-6 text-center'>
        <div className='text-red-600 mb-4'>
            <AlertCircle className='w-12 h-12 mx-auto mb-4' />
            <h3 className='text-lg font-medium'>Error Loading Dashboard</h3>
            <p className='text-sm'>{message}</p>
        </div>
        <button
            onClick={onRetry}
            className='bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-6 py-2 rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 font-medium cursor-pointer'
        >
            <RefreshCw className='w-4 h-4 inline mr-2' />
            Retry
        </button>
    </div>
);

export const LoadingDashboard: React.FC = () => (
    <div className='min-h-screen'>
        <div className='max-w-7xl mx-auto space-y-6'>
            <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Loading Dashboard...</h1>
                <p className='text-[#C75D2C]/70 mt-1'>Fetching your statistics</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {Array.from({ length: 8 }).map((_, i) => (
                    <LoadingCard key={i} />
                ))}
            </div>
        </div>
    </div>
);
