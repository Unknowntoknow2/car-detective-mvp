
import React from "react";
import { LoadingState as UnifiedLoadingState } from "@/components/common/UnifiedLoadingSystem";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
}) => {
  return (
    <UnifiedLoadingState 
      message={message}
      size="lg"
      className="py-12"
    />
  );
};

export default LoadingState;
