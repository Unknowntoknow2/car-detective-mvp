
import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
};

export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  // If only description is provided, use it as the title for sonner
  const message = title || description || '';
  const options = {
    description: title ? description : undefined,
  };
  
  if (variant === 'destructive') {
    return sonnerToast.error(message, options);
  }
  
  if (variant === 'success') {
    return sonnerToast.success(message, options);
  }
  
  if (variant === 'warning') {
    return sonnerToast.warning(message, options);
  }
  
  return sonnerToast(message, options);
};

export const useToast = () => {
  return {
    toast,
  };
};
