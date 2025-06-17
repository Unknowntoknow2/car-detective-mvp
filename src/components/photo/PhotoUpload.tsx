
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';

interface PhotoUploadProps {
  isLoading?: boolean;
  vehicle?: any;
  onPhotosChange?: (photos: File[]) => void;
  onPhotoUpload?: (files: File[]) => void;
  maxFiles?: number;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  isLoading = false,
  vehicle,
  onPhotosChange,
  onPhotoUpload,
  maxFiles = 10
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles);
    setUploadedFiles(newFiles);
    onPhotosChange?.(newFiles);
    onPhotoUpload?.(acceptedFiles);
  }, [uploadedFiles, maxFiles, onPhotosChange, onPhotoUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: isLoading
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onPhotosChange?.(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the photos here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop vehicle photos here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Upload up to {maxFiles} photos (JPEG, PNG, WebP)
            </p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="text-sm text-gray-600">
          {uploadedFiles.length} of {maxFiles} photos uploaded
        </div>
      )}
    </div>
  );
};
