<<<<<<< HEAD
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X, Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
=======
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DesignCard } from "@/components/ui/design-system";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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

<<<<<<< HEAD
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
=======
  const processImage = (
    file: File,
  ): Promise<{ preview: string; score?: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;

        // Simulate AI scoring with a delay
        setTimeout(() => {
          // Generate a random score between 60 and 95
          const score = Math.floor(Math.random() * 36) + 60;
          resolve({ preview, score });
        }, 1500); // Simulate network delay
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || photos.length >= MAX_PHOTOS) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).slice(
        0,
        MAX_PHOTOS - photos.length,
      );

      // Filter for image files and size
      const validFiles = newFiles.filter((file) => {
        const isImage = file.type.startsWith("image/");
        const isUnderSizeLimit = file.size <= MAX_SIZE_MB * 1024 * 1024;
        return isImage && isUnderSizeLimit;
      });

      // Add files with processing flag
      const newPhotos = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        processing: true,
      }));

      setPhotos([...photos, ...newPhotos]);

      // Process each image with AI scoring
      for (let i = 0; i < validFiles.length; i++) {
        const result = await processImage(validFiles[i]);

        setPhotos((prev) =>
          prev.map((photo, index) => {
            if (index === photos.length + i) {
              return {
                ...photo,
                score: result.score,
                processing: false,
              };
            }
            return photo;
          })
        );
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || photos.length >= MAX_PHOTOS) return;

    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).slice(
        0,
        MAX_PHOTOS - photos.length,
      );

      // Filter for image files and size
      const validFiles = newFiles.filter((file) => {
        const isImage = file.type.startsWith("image/");
        const isUnderSizeLimit = file.size <= MAX_SIZE_MB * 1024 * 1024;
        return isImage && isUnderSizeLimit;
      });

      // Add files with processing flag
      const newPhotos = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        processing: true,
      }));

      setPhotos([...photos, ...newPhotos]);

      // Process each image with AI scoring
      for (let i = 0; i < validFiles.length; i++) {
        const result = await processImage(validFiles[i]);

        setPhotos((prev) =>
          prev.map((photo, index) => {
            if (index === photos.length + i) {
              return {
                ...photo,
                score: result.score,
                processing: false,
              };
            }
            return photo;
          })
        );
      }
    }

    // Reset file input
    e.target.value = "";
  };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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

<<<<<<< HEAD
  return (
    <div className={cn('space-y-4', className)}>
=======
  const averageScore = photos.length > 0
    ? Math.round(
      photos.reduce((acc, photo) => acc + (photo.score || 0), 0) /
        photos.length,
    )
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Vehicle Photos
        </h3>
        <Badge variant="outline" className="bg-primary-light/20">
          AI-Powered
        </Badge>
      </div>

      <p className="text-sm text-text-secondary">
        Upload up to 5 photos of your vehicle. Our AI will analyze them to
        improve valuation accuracy. Include exterior, interior, and any damage
        for best results.
      </p>

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
<<<<<<< HEAD
            <p className="text-xs text-muted-foreground">
              {selectedFiles.length === 0
                ? `Upload up to ${maxPhotos} photos`
                : `${selectedFiles.length} of ${maxPhotos} photos selected`}
=======
            <p className="text-xs text-text-secondary mt-1">
              Max {MAX_PHOTOS} photos (JPG, PNG, WEBP, up to{" "}
              {MAX_SIZE_MB}MB each)
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
<<<<<<< HEAD
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
=======
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Uploaded Photos</h4>
            {photos.some((p) => p.score !== undefined) && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">
                  Average Condition Score:
                </span>
                <Badge className={`${getScoreColor(averageScore)}`}>
                  {averageScore}/100
                </Badge>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {photos.map((photo, index) => (
              <DesignCard
                key={index}
                variant="outline"
                className="relative aspect-square group overflow-hidden"
              >
                <img
                  src={photo.preview}
                  alt={`Vehicle photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
                {photo.processing
                  ? (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 flex items-center justify-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Analyzing...
                    </div>
                  )
                  : photo.score !== undefined
                  ? (
                    <div
                      className={`absolute bottom-0 left-0 right-0 ${
                        getScoreColor(photo.score)
                      } text-white text-xs p-2 flex items-center justify-between`}
                    >
                      <span>Condition</span>
                      <div className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {photo.score}/100
                      </div>
                    </div>
                  )
                  : null}
              </DesignCard>
            ))}
            {Array.from({ length: MAX_PHOTOS - photos.length }).map((
              _,
              index,
            ) => (
              <div
                key={`empty-${index}`}
                className="aspect-square border border-dashed border-border rounded-lg flex items-center justify-center"
              >
                <ImagePlus className="h-6 w-6 text-text-tertiary" />
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
