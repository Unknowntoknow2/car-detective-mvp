
import React from 'react';
import { Photo } from '@/types/photo';

interface PhotoGridProps {
  photos: Photo[];
  onSelectPhoto?: (photo: Photo) => void;
  className?: string;
}

export function PhotoGrid({ photos, onSelectPhoto, className = '' }: PhotoGridProps) {
  if (!photos.length) return null;
  
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-square overflow-hidden rounded-md border border-border cursor-pointer"
          onClick={() => onSelectPhoto?.(photo)}
        >
          <img
            src={photo.url}
            alt="Vehicle photo"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
