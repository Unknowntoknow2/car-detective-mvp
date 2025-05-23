
import React, { useState } from 'react';
import { DealerSidebar } from '@/components/dealer/DealerSidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface DealerLayoutProps {
  children: React.ReactNode;
}

const DealerLayout: React.FC<DealerLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <DealerSidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DealerLayout;
