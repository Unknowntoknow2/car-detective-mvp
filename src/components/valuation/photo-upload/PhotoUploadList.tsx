
import React from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Photo } from '@/types/photo';
import { Button } from '@/components/ui/button';

interface PhotoUploadListProps {
  photos: Photo[];
  onRemove: (id: string) => void;
}

export const PhotoUploadList: React.FC<PhotoUploadListProps> = ({ photos, onRemove }) => {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Selected Photos</h3>
      <ul className="space-y-2">
        {photos.map((photo) => (
          <li key={photo.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-slate-200 rounded overflow-hidden flex items-center justify-center">
                {photo.url && (
                  <img 
                    src={photo.url} 
                    alt={`Vehicle photo ${photo.id}`} 
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{photo.name}</p>
                <p className="text-xs text-slate-500 truncate">
                  {photo.size ? `${Math.round(photo.size / 1024)} KB` : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {photo.uploading && (
                <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
              )}
              
              {photo.uploaded && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              
              {photo.error && (
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-500 max-w-[150px] truncate">
                    {photo.error}
                  </span>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemove(photo.id)}
                disabled={photo.uploading}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhotoUploadList;
