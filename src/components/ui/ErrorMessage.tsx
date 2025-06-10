
import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  if (!message) return null;

  return (
    <div className={cn("flex items-center gap-2 text-destructive", className)}>
      <AlertCircle className="h-4 w-4" role="img" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
