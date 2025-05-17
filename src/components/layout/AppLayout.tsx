
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AIAssistantTrigger } from '@/components/chat/AIAssistantTrigger';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <AIAssistantTrigger />
      </div>
    </TooltipProvider>
  );
};

export default AppLayout;
