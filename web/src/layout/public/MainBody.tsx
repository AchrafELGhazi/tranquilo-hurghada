import React, { type ReactNode } from 'react';

interface MainBodyProps {
      children: ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({ children }) => {
      return <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>{children}</main>;
};
