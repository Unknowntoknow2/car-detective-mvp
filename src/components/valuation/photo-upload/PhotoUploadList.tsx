
import React from 'react';
import { Photo } from '@/types/photo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Check, AlertCircle, Loader2 } from 'lucide-react';

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
      <h3 className="text-sm font-medium">Uploaded Photos ({photos.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-slate-100">
              {photo.url ? (
                <img
                  src={photo.url}
                  alt="Vehicle"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {photo.uploading ? (
                    <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                  ) : (
                    <div className="w-full h-full bg-slate-200" />
                  )}
                </div>
              )}
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-7 w-7 opacity-90"
                onClick={() => onRemove(photo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {photo.error && (
                <div className="absolute bottom-0 inset-x-0 bg-red-500 text-white text-xs p-1">
                  <div className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span className="truncate">{photo.error}</span>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="text-xs truncate">
                  {photo.uploading && (
                    <span className="text-slate-500">Uploading...</span>
                  )}
                  {photo.uploaded && (
                    <span className="text-green-600 flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Uploaded
                    </span>
                  )}
                  {photo.error && (
                    <span className="text-red-500">Failed</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
