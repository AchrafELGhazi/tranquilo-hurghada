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
            <div className='min-h-screen bg-gray-100 dark:bg-gray-900 flex'>
                  <AdminSidebar />
                  <div className='flex-1 flex flex-col'>
                        <AdminHeader />
                        <AdminMainContent>{children}</AdminMainContent>
                  </div>
            </div>
      );
};
