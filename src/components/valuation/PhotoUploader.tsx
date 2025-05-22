import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DesignCard } from "@/components/ui/design-system";
import { Badge } from "@/components/ui/badge";
import { 
  ImagePlus, 
  Trash2, 
  AlertCircle, 
  Camera, 
  X,
  Upload,
  Loader2,
  Check
} from "lucide-react";

interface PhotoUploaderProps {
  disabled?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  disabled = false,
}) => {
  const [photos, setPhotos] = useState<
    Array<{ file: File; preview: string; score?: number; processing?: boolean }>
  >([]);
  const [dragActive, setDragActive] = useState(false);

  const MAX_PHOTOS = 5;
  const MAX_SIZE_MB = 10;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processImage = (file: File): Promise<{ preview: string; score?: number }> => {
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
      const newFiles = Array.from(e.dataTransfer.files).slice(0, MAX_PHOTOS - photos.length);
      
      // Filter for image files and size
      const validFiles = newFiles.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isUnderSizeLimit = file.size <= MAX_SIZE_MB * 1024 * 1024;
        return isImage && isUnderSizeLimit;
      });
      
      // Add files with processing flag
      const newPhotos = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        processing: true
      }));
      
      setPhotos([...photos, ...newPhotos]);
      
      // Process each image with AI scoring
      for (let i = 0; i < validFiles.length; i++) {
        const result = await processImage(validFiles[i]);
        
        setPhotos(prev => prev.map((photo, index) => {
          if (index === photos.length + i) {
            return {
              ...photo,
              score: result.score,
              processing: false
            };
          }
          return photo;
        }));
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || photos.length >= MAX_PHOTOS) return;
    
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).slice(0, MAX_PHOTOS - photos.length);
      
      // Filter for image files and size
      const validFiles = newFiles.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isUnderSizeLimit = file.size <= MAX_SIZE_MB * 1024 * 1024;
        return isImage && isUnderSizeLimit;
      });
      
      // Add files with processing flag
      const newPhotos = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        processing: true
      }));
      
      setPhotos([...photos, ...newPhotos]);
      
      // Process each image with AI scoring
      for (let i = 0; i < validFiles.length; i++) {
        const result = await processImage(validFiles[i]);
        
        setPhotos(prev => prev.map((photo, index) => {
          if (index === photos.length + i) {
            return {
              ...photo,
              score: result.score,
              processing: false
            };
          }
          return photo;
        }));
      }
    }
    
    // Reset file input
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    URL.revokeObjectURL(newPhotos[index].preview);
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-success text-white";
    if (score >= 70) return "bg-warning text-white";
    return "bg-error text-white";
  };

  const averageScore = photos.length > 0 
    ? Math.round(photos.reduce((acc, photo) => acc + (photo.score || 0), 0) / photos.length) 
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
        Upload up to 5 photos of your vehicle. Our AI will analyze them to improve valuation accuracy.
        Include exterior, interior, and any damage for best results.
      </p>

      <div
        className={`border-2 ${
          dragActive ? "border-primary" : "border-dashed border-border"
        } rounded-lg p-8 text-center transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary-light/30 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Drag photos here or click to upload
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Max {MAX_PHOTOS} photos (JPG, PNG, WEBP, up to {MAX_SIZE_MB}MB each)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="relative"
            disabled={disabled || photos.length >= MAX_PHOTOS}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={disabled || photos.length >= MAX_PHOTOS}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            Select Photos
          </Button>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Uploaded Photos</h4>
            {photos.some(p => p.score !== undefined) && (
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
              <Card 
                key={index} 
                variant="outlined" 
                className="relative aspect-square overflow-hidden"
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
                {photo.processing ? (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 flex items-center justify-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing...
                  </div>
                ) : photo.score !== undefined ? (
                  <div className={`absolute bottom-0 left-0 right-0 ${getScoreColor(photo.score)} text-white text-xs p-2 flex items-center justify-between`}>
                    <span>Condition</span>
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {photo.score}/100
                    </div>
                  </div>
                ) : null}
              </Card>
            ))}
            {Array.from({ length: MAX_PHOTOS - photos.length }).map((_, index) => (
              <div 
                key={`empty-${index}`}
                className="aspect-square border border-dashed border-border rounded-lg flex items-center justify-center"
              >
                <ImagePlus className="h-6 w-6 text-text-tertiary" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
