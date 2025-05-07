
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col flex-1">
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
