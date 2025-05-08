
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { MAX_FILES } from '@/types/photo';

interface PhotoUploadDropzoneProps {
  onDrop: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export function PhotoUploadDropzone({
  onDrop,
  maxFiles = MAX_FILES,
  className = '',
  disabled = false
}: PhotoUploadDropzoneProps) {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    maxFiles,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled
  });
  
  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload className="h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium">
          {disabled 
            ? 'Upload limit reached'
            : isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop your vehicle photos here'
          }
        </p>
        <p className="text-xs text-muted-foreground">
          Or click to browse (max {maxFiles} photos, 10MB each)
        </p>
      </div>
    </div>
  );
}
