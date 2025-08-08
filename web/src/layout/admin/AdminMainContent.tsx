import React, { type ReactNode } from 'react';

interface AdminMainContentProps {
    children: ReactNode;
}

export const AdminMainContent: React.FC<AdminMainContentProps> = ({ children }) => {
    return (
        <main className='flex-1 p-6 bg-gradient-to-br from-[#F3E9DC] to-[#E8DCC6] overflow-auto relative'>
            <div className='absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-[#F8B259]/10 to-transparent rounded-full blur-2xl pointer-events-none'></div>
            <div className='absolute bottom-10 left-10 w-40 h-40 bg-gradient-radial from-[#D96F32]/5 to-transparent rounded-full blur-3xl pointer-events-none'></div>

            <div className='relative z-10 max-w-full'>{children}</div>
        </main>
    );
};
