<<<<<<< HEAD

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormValidationErrorProps {
  error: string;
  variant?: 'error' | 'warning' | 'info';
}

export function FormValidationError({ error, variant = 'error' }: FormValidationErrorProps) {
  if (!error) return null;
  
  const variantClasses = {
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
=======
import React from "react";
import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";

interface FormValidationErrorProps {
  error: string;
  variant?: "error" | "warning" | "info";
  className?: string;
  details?: string; // Make sure the details prop is included
}

export function FormValidationError({
  error,
  variant = "error",
  className = "",
  details,
}: FormValidationErrorProps) {
  if (!error) return null;

  const getIcon = () => {
    switch (variant) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "error":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-red-500";
    }
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };

  return (
<<<<<<< HEAD
    <div className={`flex items-center mt-1 text-sm ${variantClasses[variant]}`}>
      <AlertCircle className="h-3.5 w-3.5 mr-1" />
      <span>{error}</span>
=======
    <div
      className={`flex items-start gap-2 text-sm ${getTextColor()} ${className}`}
    >
      {getIcon()}
      <div>
        <p>{error}</p>
        {details && <p className="text-xs mt-1 opacity-80">{details}</p>}
      </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </div>
  );
}
