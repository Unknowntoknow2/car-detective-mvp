
import React from 'react';
import { Toaster } from 'sonner';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
};

export default ToastProvider;
