import React from 'react';
import { Calendar } from 'lucide-react';

interface BookNowButtonProps {
    lang: string;
    mobile?: boolean;
}

export const BookNowButton: React.FC<BookNowButtonProps> = ({ lang, mobile = false }) => {
    const handleBookNowClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/${lang}/booking`;
    };

    if (mobile) {
        return (
            <button
                onClick={handleBookNowClick}
                className='bg-white/80 backdrop-blur-md border-2 border-[#F8B259]/70 text-[#C75D2C] px-3 py-2 rounded-xl shadow-lg transition-all duration-300 hover:bg-white hover:border-[#D96F32] hover:text-[#D96F32] hover:-translate-y-0.5 active:scale-95'
            >
                <Calendar className='w-5 h-5' />
            </button>
        );
    }

    return (
        <button
            onClick={handleBookNowClick}
            className='group relative cursor-pointer flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-500 bg-white/80 backdrop-blur-md border-2 border-[#F8B259]/70 text-[#C75D2C] hover:bg-white hover:border-[#D96F32] hover:text-[#D96F32] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 whitespace-nowrap overflow-hidden min-w-[8rem]'
        >
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-[#F8B259]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out'></div>
            </div>
            <Calendar className='w-4 h-4 relative z-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0' />
            <span className='relative z-10 tracking-wide font-bold'>Book Now</span>
        </button>
    );
};
