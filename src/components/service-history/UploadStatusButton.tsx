
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface UploadStatusButtonProps {
  isUploading: boolean;
  disabled: boolean;
  onSubmit: () => void;
}

export function UploadStatusButton({ isUploading, disabled, onSubmit }: UploadStatusButtonProps) {
  return (
    <Button type="button" onClick={onSubmit} disabled={isUploading || disabled}>
      {isUploading ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <CheckCircle2 size={16} className="mr-2" />
          Save Service Record
        </>
      )}
    </Button>
  );
}
