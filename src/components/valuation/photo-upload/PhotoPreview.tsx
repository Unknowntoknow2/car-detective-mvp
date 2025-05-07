
import React from 'react';
import { Photo, PhotoScore } from '@/types/photo';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Check, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoPreviewProps {
  photo: Photo;
  score?: number;
  isBestPhoto?: boolean;
  onDelete: (photo: Photo) => void;
  isLoading?: boolean;
}

export function PhotoPreview({
  photo,
  score,
  isBestPhoto = false,
  onDelete,
  isLoading = false
}: PhotoPreviewProps) {
  // Helper to get color class based on score
  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return "bg-green-500 text-white";
    if (score >= 0.6) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <Card className={cn(
      "relative overflow-hidden aspect-square group",
      isBestPhoto ? "border-primary border-2" : ""
    )}>
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
        disabled={isLoading}
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
            <span>{isBestPhoto ? "Best Quality" : "Quality"}</span>
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
}
