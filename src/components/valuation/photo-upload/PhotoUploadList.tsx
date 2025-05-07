
import React from 'react';
import { Photo } from '@/types/photo';
import { Trash2, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadListProps {
  photos: Photo[];
  onRemove: (photoId: string) => void;
}

export function PhotoUploadList({ photos, onRemove }: PhotoUploadListProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Selected Photos</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group border rounded-md overflow-hidden aspect-square"
          >
            {photo.url ? (
              <img 
                src={photo.url} 
                alt="Vehicle" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            {/* Status indicator */}
            {photo.uploading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
            
            {photo.error && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs p-1">
                Error uploading
              </div>
            )}
            
            {/* Remove button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(photo.id)}
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
