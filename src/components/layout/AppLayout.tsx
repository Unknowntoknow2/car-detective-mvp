
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AIAssistantTrigger } from '@/components/chat/AIAssistantTrigger';

// GPT_AI_ASSISTANT_V1
const AppLayout = () => {
  return (
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
  );
};

export default AppLayout;
