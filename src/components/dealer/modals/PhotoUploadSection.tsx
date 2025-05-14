
import React from 'react';
import { Upload, X } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface PhotoUploadSectionProps {
  photoUrls: string[];
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  photoUrls,
  onPhotoUpload,
  onRemovePhoto
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Vehicle Photos</h3>
      
      <div className="flex flex-col gap-4">
        {/* Photo Preview Grid */}
        {photoUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  onClick={() => onRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload Button */}
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              JPEG, PNG or WebP (max 10MB)
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            multiple 
            onChange={onPhotoUpload}
          />
        </label>
      </div>
    </div>
  );
};
