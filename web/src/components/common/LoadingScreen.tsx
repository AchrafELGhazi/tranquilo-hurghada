import React from 'react';
import { PropagateLoader } from 'react-spinners';

export interface LoadingScreenProps {
    progress?: number;
    message?: string;
    className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0, className = '' }) => {
    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-[#F3E9DC] px-4 ${className}`}>
            <div className='mb-8 sm:mb-16'>
                <img
                    src='/images/tranquilo-hurghada-logo.png'
                    alt='Tranquilo Hurghada Logo'
                    className='h-16 sm:h-28 w-auto object-contain drop-shadow-2xl'
                    onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                />
            </div>

            <div className='mb-8 sm:mb-12 text-center space-y-2 sm:space-y-3 max-w-sm sm:max-w-none'>
                <h2 className='text-lg sm:text-2xl font-light text-[#C75D2C] font-butler tracking-wide'>
                    Preparing Your Tranquil Experience
                </h2>
                <div className='flex items-center justify-center space-x-2 sm:space-x-4'>
                    <div className='w-8 sm:w-12 h-px bg-[#F8B259]'></div>
                    <div className='w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#F8B259] rounded-full'></div>
                    <div className='w-10 sm:w-16 h-px bg-[#F8B259]'></div>
                    <div className='w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#F8B259] rounded-full'></div>
                    <div className='w-8 sm:w-12 h-px bg-[#F8B259]'></div>
                </div>
                <p className='text-xs sm:text-sm text-[#C75D2C]/70 font-light italic tracking-wider'>
                    "Where luxury meets serenity"
                </p>
            </div>

            <div className='mb-8 sm:mb-12'>
                <PropagateLoader color='#D96F32' size={8} speedMultiplier={0.6} className='sm:hidden' />
                <PropagateLoader color='#D96F32' size={12} speedMultiplier={0.6} className='hidden sm:block' />
            </div>

            <div className='w-72 sm:w-96 h-1 bg-white/30 backdrop-blur-sm rounded-full mb-6 sm:mb-8 border border-[#F8B259]/20 overflow-hidden shadow-inner relative'>
                <div
                    className='h-full bg-gradient-to-r from-[#D96F32] via-[#F8B259] to-[#D96F32] rounded-full transition-all duration-700 ease-out shadow-sm'
                    style={{ width: `${progress}%` }}
                />
                <div
                    className='absolute top-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full transition-all duration-700 ease-out'
                    style={{ width: `${Math.min(progress + 10, 100)}%` }}
                />
            </div>

            <div className='flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4'>
                <div className='w-6 sm:w-8 h-px bg-[#F8B259]/60'></div>
                <div className='text-2xl sm:text-3xl font-light text-[#C75D2C] font-butler tracking-widest'>
                    {progress}%
                </div>
                <div className='w-6 sm:w-8 h-px bg-[#F8B259]/60'></div>
            </div>

            <div className='text-xs text-[#C75D2C]/50 font-light tracking-widest uppercase'>
                {progress < 25 && 'Initializing...'}
                {progress >= 25 && progress < 50 && 'Loading Assets...'}
                {progress >= 50 && progress < 75 && 'Preparing Interface...'}
                {progress >= 75 && progress < 95 && 'Finalizing...'}
                {progress >= 95 && 'Ready'}
            </div>

            {/* Background decorative elements - reduced for mobile */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-1/4 left-1/6 w-1 h-1 bg-[#F8B259]/30 rounded-full animate-pulse'></div>
                <div className='absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-[#D96F32]/20 rounded-full animate-pulse delay-1000'></div>
                <div className='absolute bottom-1/3 left-1/4 w-1 h-1 bg-[#F8B259]/25 rounded-full animate-pulse delay-2000'></div>
                <div className='absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-[#D96F32]/15 rounded-full animate-pulse delay-3000'></div>

                {/* Corner decorations - hidden on mobile for cleaner look */}
                <div className='absolute top-8 left-8 hidden sm:block'>
                    <div className='w-16 h-px bg-[#F8B259]/20 transform rotate-45'></div>
                    <div className='w-px h-16 bg-[#F8B259]/20 transform -translate-y-8 translate-x-8 -rotate-45'></div>
                </div>
                <div className='absolute top-8 right-8 hidden sm:block'>
                    <div className='w-16 h-px bg-[#F8B259]/20 transform -rotate-45'></div>
                    <div className='w-px h-16 bg-[#F8B259]/20 transform -translate-y-8 -translate-x-8 rotate-45'></div>
                </div>
                <div className='absolute bottom-8 left-8 hidden sm:block'>
                    <div className='w-16 h-px bg-[#F8B259]/20 transform -rotate-45'></div>
                    <div className='w-px h-16 bg-[#F8B259]/20 transform translate-y-8 translate-x-8 rotate-45'></div>
                </div>
                <div className='absolute bottom-8 right-8 hidden sm:block'>
                    <div className='w-16 h-px bg-[#F8B259]/20 transform rotate-45'></div>
                    <div className='w-px h-16 bg-[#F8B259]/20 transform translate-y-8 -translate-x-8 -rotate-45'></div>
                </div>
            </div>

            <div className='absolute inset-0 opacity-3'>
                <div
                    className='w-full h-full'
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 20%, #D96F32 0.5px, transparent 0.5px),
                                         radial-gradient(circle at 80% 80%, #F8B259 0.5px, transparent 0.5px)`,
                        backgroundSize: '80px 80px',
                    }}
                />
            </div>
        </div>
    );
};
