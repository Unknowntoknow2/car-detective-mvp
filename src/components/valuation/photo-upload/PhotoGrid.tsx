
import React from 'react';
import { Card } from '@/components/ui/card';
import { Photo, PhotoScore } from '@/types/photo';
import { Loader, Check, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const getPhotoScore = (photoUrl: string): PhotoScore | undefined => {
    return photoScores.find(score => score.url === photoUrl);
  };

  // Helper function to format score as percentage
  const formatScore = (score: number): string => {
    return `${Math.round(score * 100)}/100`;
  };

  // Helper function to get conditional score class
  const getScoreClass = (score: number): string => {
    if (score >= 0.85) return 'bg-green-500 text-white';
    if (score >= 0.7) return 'bg-yellow-500 text-white';
    if (score >= 0.5) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {photos.map((photo, index) => {
        const score = getPhotoScore(photo.url);
        const isBestPhoto = photo.id === bestPhotoId;
        
        return (
          <Card 
            key={photo.id || index} 
            className={cn(
              "relative overflow-hidden aspect-square group border",
              isBestPhoto ? "border-primary" : "border-border" 
            )}
          >
            {/* Photo preview */}
            <div className="w-full h-full">
              <img 
                src={photo.url} 
                alt={`Vehicle photo ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Delete button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(photo)}
              disabled={isUploading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            {/* Best photo indicator */}
            {isBestPhoto && (
              <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-1">
                <Star className="h-4 w-4 fill-white" />
              </div>
            )}
            
            {/* Score display */}
            {score ? (
              <div className={cn(
                "absolute bottom-0 left-0 right-0 p-2 text-xs font-medium",
                getScoreClass(score.score)
              )}>
                <div className="flex justify-between items-center">
                  <span>AI Score:</span>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {formatScore(score.score)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 flex items-center justify-center gap-1">
                <Loader className="h-3 w-3 animate-spin" />
                Processing...
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
