
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export function FileDropzone({ onFileSelect, selectedFile, disabled = false }: FileDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {selectedFile ? (
        <div className="flex items-center justify-center space-x-2">
          <File className="h-5 w-5 text-primary" />
          <span className="text-sm">{selectedFile.name}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? "Drop the file here"
              : "Drag and drop a file here, or click to select"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports PDF, JPG, JPEG, PNG
          </p>
        </div>
      )}
    </div>
  );
}
