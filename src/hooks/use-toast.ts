
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
};

export const useToast = () => {
  const showToast = ({
    title,
    description,
    action,
    variant,
    duration,
  }: ToastProps) => {
    sonnerToast(title, {
      description,
      action,
      className: variant ? `toast-${variant}` : "",
      duration,
    });
  };

  return {
    toast: showToast,
  };
};

export { sonnerToast as toast };
