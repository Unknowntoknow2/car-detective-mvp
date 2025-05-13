
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider } from '@/components/ui/tooltip';

const Layout = () => {
  // Get isMobile using a try-catch to handle any potential hooks errors gracefully
  let isMobile = false;
  try {
    const { isMobile: mobileValue } = useIsMobile();
    isMobile = mobileValue;
  } catch (error) {
    console.error("Error in Layout when checking mobile status:", error);
  }
  
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <main className={`flex-grow container mx-auto ${isMobile ? 'px-4 py-6' : 'px-6 py-8'}`}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default Layout;
