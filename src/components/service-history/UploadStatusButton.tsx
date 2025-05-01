
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UploadStatusButtonProps {
  isUploading: boolean;
  uploadProgress: number;
  onCancel: () => void;
}

export function UploadStatusButton({ isUploading, uploadProgress, onCancel }: UploadStatusButtonProps) {
  if (isUploading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Uploading... {uploadProgress}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
        <Progress value={uploadProgress} className="h-2" />
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={isUploading}>
        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Service Record
      </Button>
    </div>
  );
}
