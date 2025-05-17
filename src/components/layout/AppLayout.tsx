// ✅ File: src/components/layout/AppLayout.tsx

<<<<<<< HEAD
import React, { ReactNode } from 'react';
=======
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AIAssistantTrigger } from '@/components/chat/AIAssistantTrigger';
>>>>>>> origin/main

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* You can include Navbar or Footer here if global */}
      {children}
    </div>
=======
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <AIAssistantTrigger />
      </div>
    </TooltipProvider>
>>>>>>> origin/main
  );
};

export default AppLayout;
