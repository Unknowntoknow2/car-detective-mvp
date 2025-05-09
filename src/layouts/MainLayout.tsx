
import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TooltipProvider } from '@/components/ui/tooltip';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;
