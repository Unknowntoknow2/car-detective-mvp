
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "overlay" | "inline";
  className?: string;
}

export function LoadingState({ 
  text = "Loading...", 
  size = "md", 
  variant = "default",
  className = ""
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const variantClasses = {
    default: "flex flex-col items-center justify-center p-8 text-center",
    overlay: "absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10",
    inline: "flex items-center gap-2"
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin ${variant !== "inline" ? "mb-3" : ""}`} />
      {text && (
        <p className={`text-slate-600 ${variant === "inline" && size === "sm" ? "text-sm" : ""}`}>{text}</p>
      )}
    </div>
  );
}
