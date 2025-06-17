
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import Footer from './Footer';
// import { AINAssistantTrigger } from '@/components/chat/AINAssistantTrigger'; // Disabled for MVP

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
      {/* <AINAssistantTrigger /> */} {/* Disabled for MVP */}
    </div>
  );
}

export default AppLayout;
