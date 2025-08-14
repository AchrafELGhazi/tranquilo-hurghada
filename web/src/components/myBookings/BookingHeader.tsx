import React from 'react';
import { RefreshCw } from 'lucide-react';

interface BookingHeaderProps {
    onRefresh: () => void;
    loading: boolean;
}

export const BookingHeader: React.FC<BookingHeaderProps> = ({ onRefresh, loading }) => {
    return (
        <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>My Bookings</h1>
                    <p className='text-[#C75D2C]/70 mt-1'>Manage your villa reservations</p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className='flex items-center space-x-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-4 py-2 rounded-xl font-medium hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 disabled:opacity-50'
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>
        </div>
    );
};
