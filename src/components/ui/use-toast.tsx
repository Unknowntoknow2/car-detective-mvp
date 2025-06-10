
import React, { createContext, useContext, useState } from 'react';

interface ToastProps {
  description: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    setToasts(prev => [...prev, props]);
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-lg ${
                toast.variant === 'destructive' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-green-600 text-white'
              }`}
            >
              {toast.description}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const toast = (props: ToastProps) => {
  // For tests and simple usage
  console.log('Toast:', props);
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return { toast };
  }
  return context;
};
