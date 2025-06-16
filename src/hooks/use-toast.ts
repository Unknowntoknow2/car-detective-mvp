
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToasterToast = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
};

type ToastContextType = {
  toasts: ToasterToast[];
  toast: (props: Omit<ToasterToast, 'id'>) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  const toast = (props: Omit<ToasterToast, 'id'>) => {
    const id = crypto.randomUUID();
    const newToast: ToasterToast = { id, ...props };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded shadow-lg ${
              item.variant === 'destructive' 
                ? 'bg-red-600 text-white' 
                : 'bg-black text-white'
            }`}
          >
            {item.title && <div className="font-semibold">{item.title}</div>}
            {item.description && <div>{item.description}</div>}
            {item.action}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const toast = (props: Omit<ToasterToast, 'id'>) => {
  console.log('Toast:', props);
};
