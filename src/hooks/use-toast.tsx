import * as React from 'react';

import { toast as sonnerToast } from 'sonner';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

export const toast = ({
  title,
  description,
  variant = "default",
  action,
}: ToastProps) => {
  const message = title || description || '';
  const fullDescription = title && description ? description : undefined;

  if (variant === "destructive") {
    return sonnerToast.error(message, {
      description: fullDescription,
      action,
    });
  }

  return sonnerToast.success(message, {
    description: fullDescription,
    action,
  });
};

export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
};
