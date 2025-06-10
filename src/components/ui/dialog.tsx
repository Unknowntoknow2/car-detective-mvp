
import React from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ children, open = false, onOpenChange }: DialogProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="space-y-2">{children}</div>;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  return <>{children}</>;
}
