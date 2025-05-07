
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@/components/ui/container';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="py-4 bg-white border-b">
        <Container>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
        </Container>
      </header>
      
      <main className="flex-1 py-8">
        <Container>
          <Outlet />
        </Container>
      </main>
      
      <footer className="py-4 bg-white border-t">
        <Container>
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} Car Detective. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default DashboardLayout;
