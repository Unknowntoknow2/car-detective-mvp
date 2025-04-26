
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message, 
  onRetry,
  icon,
  variant = "default",
  className = ""
}: ErrorStateProps) {
  const variantClasses = {
    default: "flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-100",
    compact: "flex flex-col items-center justify-center p-4 text-center bg-red-50 rounded-lg border border-red-100",
    inline: "flex items-center gap-3 p-3 bg-red-50 rounded-md border border-red-100"
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {variant === "inline" ? (
        <>
          {icon || <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />}
          <div className="flex-1">
            <p className="text-red-600 text-sm">{message}</p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="border-red-200 hover:bg-red-100">
              Retry
            </Button>
          )}
        </>
      ) : (
        <>
          {icon || <AlertTriangle className={`${variant === "compact" ? "h-6 w-6" : "h-8 w-8"} text-red-500 mb-3`} />}
          <h3 className={`${variant === "compact" ? "text-base" : "text-lg"} font-semibold text-red-700 mb-2`}>{title}</h3>
          <p className="text-red-600 mb-4 max-w-md">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="border-red-200 hover:bg-red-100">
              Try Again
            </Button>
          )}
        </>
      )}
    </div>
  );
}
