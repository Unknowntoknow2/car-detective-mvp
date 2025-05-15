
import React, { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="lg:hidden">
      {children}
    </div>
  );
};
