
import React from 'react';
import { PhotoPreview } from './PhotoPreview';
import { Photo } from '@/types/photo';

interface PhotoUploadListProps {
  photos: Photo[];
  onRemove?: (photo: Photo) => void;
  selectedPhotoId?: string;
  onSelectPhoto?: (photo: Photo) => void;
}

export function PhotoUploadList({ 
  photos, 
  onRemove,
  selectedPhotoId,
  onSelectPhoto
}: PhotoUploadListProps) {
  if (!photos.length) return null;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <div 
          key={photo.id}
          className="cursor-pointer"
          onClick={() => onSelectPhoto?.(photo)}
        >
          <PhotoPreview 
            photo={photo} 
            onRemove={onRemove ? () => onRemove(photo) : undefined}
            isSelected={selectedPhotoId === photo.id}
          />
        </div>
      ))}
    </div>
  );
}
