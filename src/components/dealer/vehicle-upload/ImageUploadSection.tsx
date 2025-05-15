
import React from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Progress } from '@/components/ui/progress';

interface ImageUploadSectionProps {
  photoUrls: string[];
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
  isUploading: boolean;
  uploadProgress?: number;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  photoUrls,
  handlePhotoUpload,
  removePhoto,
  isUploading,
  uploadProgress = 0
}) => {
  return (
    <div className="space-y-4">
      {/* Photo Preview Grid */}
      {photoUrls.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photoUrls.map((url, index) => (
              <div key={index} className="relative group">
                <AspectRatio ratio={4/3}>
                  <img 
                    src={url} 
                    alt={`Vehicle preview ${index + 1}`}
                    className="object-cover w-full h-full rounded-md" 
                  />
                </AspectRatio>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {isUploading && (
        <div className="py-2">
          <div className="flex items-center gap-2 mb-1">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Uploading photos...</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {/* Upload Button */}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-1 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            JPEG, PNG or WebP (max 5 photos, 10MB each)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={handlePhotoUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ImageUploadSection;
