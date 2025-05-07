
import React from 'react';
import { Photo, PhotoScore } from '@/types/photo';
import { Card } from '@/components/ui/card';
import { Loader, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PhotoGridProps {
  photos: Photo[];
  photoScores: PhotoScore[];
  bestPhotoId?: string;
  onDelete: (photo: Photo) => void;
  isUploading: boolean;
}

export function PhotoGrid({ 
  photos, 
  photoScores, 
  bestPhotoId, 
  onDelete, 
  isUploading 
}: PhotoGridProps) {
  // Helper function to get score for a photo
  const getPhotoScore = (photoId?: string): number | undefined => {
    if (!photoId) return undefined;
    const photoScore = photoScores.find(p => p.url === photos.find(photo => photo.id === photoId)?.url);
    return photoScore?.score;
  };

  // Helper to get color class based on score
  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return "bg-green-500 text-white";
    if (score >= 0.6) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {photos.map((photo) => {
        const score = getPhotoScore(photo.id);
        const isBestPhoto = photo.id === bestPhotoId;
        
        return (
          <Card 
            key={photo.id} 
            className={cn(
              "relative overflow-hidden aspect-square group border",
              isBestPhoto ? "border-primary border-2" : "border-border"
            )}
          >
            <img 
              src={photo.url}
              alt="Vehicle photo"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {isBestPhoto && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary">Best Photo</Badge>
              </div>
            )}

            {/* Delete button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(photo)}
              disabled={isUploading}
              aria-label="Delete photo"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            {/* Score indicator */}
            {score !== undefined ? (
              <div className={cn(
                "absolute bottom-0 left-0 right-0 py-1 px-2",
                getScoreColor(score)
              )}>
                <div className="flex justify-between items-center text-xs">
                  <span>{isBestPhoto ? "Highest Quality" : "Quality Score"}</span>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {Math.round(score * 100)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white py-1 px-2">
                <div className="flex items-center justify-center text-xs gap-1">
                  <Loader className="h-3 w-3 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
