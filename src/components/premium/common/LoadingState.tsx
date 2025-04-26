
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ text = "Loading...", size = "md" }: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin mb-3`} />
      <p className="text-slate-600">{text}</p>
    </div>
  );
}
