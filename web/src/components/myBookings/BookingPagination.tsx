import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const BookingPagination: React.FC<BookingPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className='px-6 py-4 border-t-2 border-[#F8B259]/50 bg-gradient-to-r from-[#F8B259]/10 to-[#D96F32]/10'>
            <div className='flex items-center justify-between'>
                <div className='text-sm text-[#C75D2C]/70'>
                    Page {currentPage} of {totalPages}
                </div>
                <div className='flex items-center space-x-2'>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <ChevronLeft className='w-4 h-4' />
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <ChevronRight className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </div>
    );
};
