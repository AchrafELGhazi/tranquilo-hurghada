import React, { type ReactNode } from 'react';

interface AdminMainContentProps {
    children: ReactNode;
}

export const AdminMainContent: React.FC<AdminMainContentProps> = ({ children }) => {
    return (
        <main className='flex-1 p-6 bg-gradient-to-br from-[#F3E9DC] to-[#E8DCC6] overflow-y-auto overflow-x-hidden relative'>
            <div className='relative z-10 max-w-full'>{children}</div>
        </main>
    );
};
