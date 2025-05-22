import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X, Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface PhotoUploaderProps {
  onPhotosSelected: (files: File[]) => void;
  maxPhotos?: number;
  isLoading?: boolean;
  className?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onPhotosSelected,
  maxPhotos = 10,
  isLoading = false,
  className,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter to only accept images
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith('image/')
      );

      // Limit to maxPhotos
      const newFiles = [...selectedFiles, ...imageFiles].slice(0, maxPhotos);
      setSelectedFiles(newFiles);

      // Create previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);

      // Notify parent component
      onPhotosSelected(newFiles);
    },
    [selectedFiles, maxPhotos, onPhotosSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    disabled: isLoading || selectedFiles.length >= maxPhotos,
  });

  const removePhoto = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    // Notify parent component
    onPhotosSelected(newFiles);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-200 hover:bg-gray-50',
          (isLoading || selectedFiles.length >= maxPhotos) &&
            'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-full bg-primary/10">
            <ImagePlus className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive
                ? 'Drop the files here'
                : 'Drag & drop vehicle photos here'}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedFiles.length === 0
                ? `Upload up to ${maxPhotos} photos`
                : `${selectedFiles.length} of ${maxPhotos} photos selected`}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleButtonClick}
            disabled={isLoading || selectedFiles.length >= maxPhotos}
          >
            Select Files
          </Button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Selected Photos</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Revoke all URLs to avoid memory leaks
                previews.forEach((preview) => URL.revokeObjectURL(preview));
                setSelectedFiles([]);
                setPreviews([]);
                onPhotosSelected([]);
              }}
              disabled={isLoading}
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(index);
                        }}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => onPhotosSelected(selectedFiles)}
              disabled={selectedFiles.length === 0 || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Photos
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
