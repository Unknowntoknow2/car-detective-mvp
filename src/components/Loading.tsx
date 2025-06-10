
import React from "react";
import { Loader2 } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" role="status" />
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
