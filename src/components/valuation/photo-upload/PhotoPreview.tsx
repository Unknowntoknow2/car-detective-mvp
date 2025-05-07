
import React from 'react';
import { Card } from '@/components/ui/card';
import { Photo } from '@/types/photo';
import { Badge } from '@/components/ui/badge';
import { Star, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PhotoPreviewProps {
  photo: Photo;
  score?: number;
  isBestPhoto?: boolean;
  showScoreBadge?: boolean;
}

export function PhotoPreview({
  photo,
  score,
  isBestPhoto = false,
  showScoreBadge = true
}: PhotoPreviewProps) {
  // Helper to format score as percentage
  const formatScore = (score?: number): string => {
    if (score === undefined) return 'N/A';
    return `${Math.round(score * 100)}/100`;
  };
  
  // Helper to get conditional class based on score
  const getScoreClass = (score?: number): string => {
    if (score === undefined) return 'bg-gray-500';
    if (score >= 0.85) return 'bg-green-500';
    if (score >= 0.7) return 'bg-blue-500';
    if (score >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className="relative overflow-hidden border">
      <div className="aspect-square">
        <img 
          src={photo.url} 
          alt="Vehicle photo" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Best photo indicator */}
      {isBestPhoto && (
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary flex items-center gap-1">
            <Star className="h-3 w-3 fill-white" />
            <span>Best Photo</span>
          </Badge>
        </div>
      )}
      
      {/* Score badge */}
      {showScoreBadge && score !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="flex justify-between items-center">
            <Badge className={`${getScoreClass(score)} w-full justify-between`}>
              <span>AI Score</span>
              <span>{formatScore(score)}</span>
            </Badge>
            
            {/* AI Explanation tooltip */}
            {photo.explanation && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1 bg-primary rounded-full flex items-center justify-center w-6 h-6">
                      <Info className="h-3 w-3 text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      <span className="font-bold">AI Assessment:</span> {photo.explanation}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
