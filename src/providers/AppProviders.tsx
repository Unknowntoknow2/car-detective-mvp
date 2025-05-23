
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './ToastProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <ToastProvider>
        {children}
      </ToastProvider>
    </BrowserRouter>
  );
};
