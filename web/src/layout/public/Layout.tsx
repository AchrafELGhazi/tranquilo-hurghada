import React, { type ReactNode } from 'react';
import { useRTL, useSyncLanguage } from '@/hooks';
import { MainBody } from './MainBody';
import { Footer } from './Footer';
import { NavigationBar } from './NavigationBar';

interface LayoutProps {
      children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
      useSyncLanguage();
      useRTL();

      return (
            <div className='min-h-screen'>
                  <NavigationBar />
                  <MainBody>{children}</MainBody>
                  <Footer />
            </div>
      );
};
