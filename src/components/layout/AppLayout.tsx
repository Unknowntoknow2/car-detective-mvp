// ✅ File: src/components/layout/AppLayout.tsx

import React, { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* You can include Navbar or Footer here if global */}
      {children}
    </div>
  );
};

export default AppLayout;
