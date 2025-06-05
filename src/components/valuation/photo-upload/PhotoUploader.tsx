
import React, { useState, useCallback } from "react";
import { Upload, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PhotoUploaderProps {
  onPhotosUploaded: (photos: File[]) => void;
  maxPhotos?: number;
  isUploading?: boolean;
}

export function PhotoUploader({
  onPhotosUploaded,
  maxPhotos = 5,
  isUploading = false,
}: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPhotos = [...photos, ...files].slice(0, maxPhotos);
    setPhotos(newPhotos);

    // Generate previews
    const newPreviews = newPhotos.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    onPhotosUploaded(newPhotos);
  }, [photos, maxPhotos, onPhotosUploaded]);

  const removePhoto = useCallback((index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setPhotos(newPhotos);
    setPreviews(newPreviews);
    onPhotosUploaded(newPhotos);
  }, [photos, previews, onPhotosUploaded]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Upload Vehicle Photos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Vehicle photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Click to upload or drag and drop vehicle photos
            </p>
            <p className="text-xs text-gray-500 mb-4">
              JPG, PNG or WebP (max 10MB each)
            </p>
            <Button
              variant="outline"
              disabled={isUploading || photos.length >= maxPhotos}
              asChild
            >
              <label className="cursor-pointer">
                Upload Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isUploading || photos.length >= maxPhotos}
                />
              </label>
            </Button>
          </div>

          {photos.length > 0 && (
            <p className="text-xs text-gray-500 text-center">
              {photos.length} of {maxPhotos} photos uploaded
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PhotoUploader;
