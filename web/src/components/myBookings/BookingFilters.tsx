import React from 'react';
import { Filter } from 'lucide-react';
import { getStatusText } from '@/utils/bookingUtils';
import type { BookingFilters } from '@/api/bookingApi';

interface BookingFiltersProps {
    filters: BookingFilters;
    onFilterChange: (newFilters: Partial<BookingFilters>) => void;
}

const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'] as const;

export const BookingFiltersComponent: React.FC<BookingFiltersProps> = ({ filters, onFilterChange }) => {
    return (
        <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex items-center space-x-2'>
                    <Filter className='w-4 h-4 text-[#D96F32]' />
                    <span className='text-sm font-medium text-[#C75D2C]'>Filter by status:</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => onFilterChange({ status: status === 'ALL' ? undefined : (status as any) })}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                (status === 'ALL' && !filters.status) || filters.status === status
                                    ? 'bg-[#D96F32] text-white'
                                    : 'bg-white/50 text-[#C75D2C] hover:bg-white/70'
                            }`}
                        >
                            {status === 'ALL' ? 'All' : getStatusText(status as any)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
