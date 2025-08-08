import React, { type ReactNode } from 'react';
import { useRTL, useSyncLanguage } from '@/hooks';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminMainContent } from './AdminMainContent';

interface AdminLayoutProps {
    children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    useSyncLanguage();
    useRTL();

    return (
        <div className='h-screen bg-gradient-to-br from-[#E8DCC6] to-[#F8B259]/20 flex overflow-hidden'>
            <AdminSidebar />
            <div className='flex-1 flex flex-col min-w-0'>
                <AdminHeader />
                <AdminMainContent>{children}</AdminMainContent>
            </div>
        </div>
    );
};
