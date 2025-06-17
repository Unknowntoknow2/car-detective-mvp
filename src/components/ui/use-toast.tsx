
import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss
  };
};

export const toast = sonnerToast;
