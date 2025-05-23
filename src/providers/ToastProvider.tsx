
import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
};

// Add a default export for compatibility with imports
export default ToastProvider;
