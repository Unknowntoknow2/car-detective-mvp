
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon, Camera } from 'lucide-react';

interface PhotoViewProps {
  photoUrl: string;
  score?: number | null;
  explanation?: string | null;
}

export function PhotoView({ photoUrl, score, explanation }: PhotoViewProps) {
  // Format score as percentage
  const formatScore = (score?: number | null): string => {
    if (score === undefined || score === null) return 'N/A';
    return `${Math.round(score * 100)}/100`;
  };

  // Get score color class
  const getScoreColorClass = (score?: number | null): string => {
    if (score === undefined || score === null) return 'bg-gray-500';
    if (score >= 0.85) return 'bg-green-500';
    if (score >= 0.7) return 'bg-blue-500';
    if (score >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-4 w-4" />
          AI Photo Assessment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative">
          {/* Photo */}
          <div className="aspect-video">
            <img 
              src={photoUrl} 
              alt="Vehicle photo" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Score badge */}
          <div className="absolute top-2 right-2">
            <Badge className={`${getScoreColorClass(score)} font-medium`}>
              Score: {formatScore(score)}
            </Badge>
          </div>
        </div>
        
        {/* Explanation */}
        {explanation ? (
          <div className="p-3 bg-muted/30 border-t">
            <div className="flex items-start gap-2">
              <InfoIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-primary">AI Observation</p>
                <p className="text-sm mt-1">{explanation}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-muted/30 border-t">
            <p className="text-sm text-muted-foreground text-center">
              No AI assessment available for this photo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
