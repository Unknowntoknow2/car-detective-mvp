
import { toast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export const useToast = () => {
  const showToast = ({
    title,
    description,
    action,
  }: ToastProps) => {
    toast(title, {
      description,
      action,
    });
  };

  return {
    toast: showToast,
  };
};

export { toast };
