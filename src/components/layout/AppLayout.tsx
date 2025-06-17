
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import Footer from './Footer';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="flex-grow min-h-0">
        {children || <Outlet />}
      </main>
      <Footer />
    </>
  );
}

export default AppLayout;
