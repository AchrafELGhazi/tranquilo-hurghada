import React, { type ReactNode } from 'react';

interface MainBodyProps {
      children: ReactNode;
}

export const MainBody: React.FC<MainBodyProps> = ({ children }) => {
      return <main className='max-w-12xl mx-auto  bg-cream'>{children}</main>;
};
