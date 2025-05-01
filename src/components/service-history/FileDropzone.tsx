
import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export function FileDropzone({ onFileSelect, selectedFile, disabled = false }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  }, [onFileSelect, disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
    }
  }, [onFileSelect, disabled]);

  const removeFile = useCallback(() => {
    onFileSelect(null as unknown as File);
  }, [onFileSelect]);

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {selectedFile ? (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <File className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / 1024).toFixed(0)} KB)
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            disabled={disabled}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-center">
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Drag and drop file here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Support for PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={handleFileInputChange}
            accept=".pdf,.jpg,.jpeg,.png"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={disabled}
          >
            Browse files
          </Button>
        </div>
      )}
    </div>
  );
}
