
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useIsMobile } from '@/hooks/use-mobile';

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className={`flex-grow container mx-auto ${isMobile ? 'px-4 py-6' : 'px-6 py-8'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
