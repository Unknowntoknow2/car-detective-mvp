
import React from 'react';

interface UploadProgressIndicatorProps {
  progress: number;
  error: string | null;
}

export const UploadProgressIndicator: React.FC<UploadProgressIndicatorProps> = ({ 
  progress, 
  error 
}) => {
  return (
    <div className="py-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">
          {error ? 'Upload Failed' : 'Uploading Vehicle'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {error ? error : `Progress: ${progress}%`}
        </p>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${error ? 'bg-red-500' : 'bg-primary'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
