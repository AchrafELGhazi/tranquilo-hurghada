import React, { type ReactNode } from 'react';

interface AdminMainContentProps {
      children: ReactNode;
}

export const AdminMainContent: React.FC<AdminMainContentProps> = ({ children }) => {
      return (
            <main className='flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto'>
                  <div className='max-w-full'>{children}</div>
            </main>
      );
};
