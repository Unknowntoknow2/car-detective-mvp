
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className={cn("flex items-center gap-2 text-destructive text-sm", className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
