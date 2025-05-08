
import React from 'react';
import { X } from 'lucide-react';
import { Photo } from '@/types/photo';

interface PhotoPreviewProps {
  photo: Photo;
  onRemove?: () => void;
  isSelected?: boolean;
}

export function PhotoPreview({ photo, onRemove, isSelected }: PhotoPreviewProps) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-md ${isSelected ? 'ring-2 ring-primary' : 'border border-border'}`}>
      {photo.uploading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <img
            src={photo.url || URL.createObjectURL(photo.file as File)}
            alt={photo.name || "Vehicle photo"}
            className="h-full w-full object-cover"
          />
          
          {onRemove && (
            <button
              type="button"
              className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
