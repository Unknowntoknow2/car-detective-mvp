
import React from 'react';
import { Photo } from '@/types/photo';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PhotoUploadListProps {
  photos: Photo[];
  onRemove: (id: string) => void;
}

export function PhotoUploadList({ photos, onRemove }: PhotoUploadListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
            {photo.preview && (
              <img
                src={photo.preview}
                alt={photo.name || 'Photo'}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-md">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => onRemove(photo.id)}
                    disabled={photo.uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove photo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {photo.uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            </div>
          )}
          
          {photo.error && (
            <div className="absolute top-1 right-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-red-600 rounded-full p-1">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{photo.error}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          <div className="mt-1 text-xs text-muted-foreground truncate">
            {photo.name}
          </div>
        </div>
      ))}
    </div>
  );
}
