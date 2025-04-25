
import { useState, useCallback, useRef, useEffect } from 'react';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: ToastProps[];
}

const TOAST_TIMEOUT = 5000;

export function useToast() {
  const [state, setState] = useState<ToastState>({
    toasts: [],
  });

  const toastTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addToast = useCallback(
    ({ title, description, type = 'default', duration = TOAST_TIMEOUT }: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);

      setState((prevState) => ({
        toasts: [...prevState.toasts, { id, title, description, type, duration }],
      }));

      if (duration) {
        const timeout = setTimeout(() => {
          removeToast(id);
        }, duration);

        toastTimeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setState((prevState) => ({
      toasts: prevState.toasts.filter((toast) => toast.id !== id),
    }));

    if (toastTimeoutsRef.current.has(id)) {
      clearTimeout(toastTimeoutsRef.current.get(id)!);
      toastTimeoutsRef.current.delete(id);
    }
  }, []);

  useEffect(() => {
    return () => {
      toastTimeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return {
    toasts: state.toasts,
    toast: {
      success: (props: Omit<ToastProps, 'id' | 'type'>) => addToast({ ...props, type: 'success' }),
      error: (props: Omit<ToastProps, 'id' | 'type'>) => addToast({ ...props, type: 'error' }),
      warning: (props: Omit<ToastProps, 'id' | 'type'>) => addToast({ ...props, type: 'warning' }),
      info: (props: Omit<ToastProps, 'id' | 'type'>) => addToast({ ...props, type: 'info' }),
      default: (props: Omit<ToastProps, 'id' | 'type'>) => addToast({ ...props }),
    },
    dismiss: removeToast,
  };
}

export const toast = {
  success: (props: string | { title: string; description?: string }) => {
    const data = typeof props === 'string' ? { title: props } : props;
    document.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          ...data,
          type: 'success',
        },
      })
    );
  },
  error: (props: string | { title: string; description?: string }) => {
    const data = typeof props === 'string' ? { title: props } : props;
    document.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          ...data,
          type: 'error',
        },
      })
    );
  },
  warning: (props: string | { title: string; description?: string }) => {
    const data = typeof props === 'string' ? { title: props } : props;
    document.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          ...data,
          type: 'warning',
        },
      })
    );
  },
  info: (props: string | { title: string; description?: string }) => {
    const data = typeof props === 'string' ? { title: props } : props;
    document.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          ...data,
          type: 'info',
        },
      })
    );
  },
  default: (props: string | { title: string; description?: string }) => {
    const data = typeof props === 'string' ? { title: props } : props;
    document.dispatchEvent(
      new CustomEvent('toast', {
        detail: {
          ...data,
          type: 'default',
        },
      })
    );
  },
};
