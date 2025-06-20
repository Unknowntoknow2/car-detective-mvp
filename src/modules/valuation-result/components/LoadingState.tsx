
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
