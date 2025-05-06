
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Photo, AICondition, PhotoScore } from '@/types/photo';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PhotoPreviewProps {
  photos: Photo[];
  photoScore: number | null;
  isUploading: boolean;
  isScoring: boolean;
  uploadProgress: number;
  onRemove: () => Promise<void>;
  aiCondition: AICondition | null;
  individualScores: PhotoScore[];
}

export function PhotoPreview({ 
  photos, 
  photoScore, 
  isUploading, 
  isScoring, 
  uploadProgress, 
  onRemove,
  aiCondition,
  individualScores
}: PhotoPreviewProps) {
  const getConditionColor = (condition: string | null | undefined) => {
    if (!condition) return "bg-gray-500";
    
    switch (condition) {
      case 'Excellent': return "bg-green-500";
      case 'Good': return "bg-emerald-500";
      case 'Fair': return "bg-amber-500";
      case 'Poor': return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getScoreBadge = (url: string) => {
    const photoScore = individualScores.find(score => score.url === url);
    
    if (!photoScore) return null;
    
    // Convert score from 0-1 range to percentage
    const scorePercentage = Math.round(photoScore.score * 100);
    
    let color = "bg-gray-500";
    if (scorePercentage >= 85) color = "bg-green-500";
    else if (scorePercentage >= 70) color = "bg-emerald-500";
    else if (scorePercentage >= 50) color = "bg-amber-500";
    else color = "bg-red-500";
    
    return (
      <Badge className={`absolute bottom-2 right-2 ${color} text-white`}>
        {scorePercentage}%
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {(isUploading || isScoring) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              {isUploading ? 'Uploading photos...' : 'Analyzing vehicle condition...'}
            </span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="relative aspect-square border rounded-md overflow-hidden group"
          >
            <img 
              src={photo.thumbnail || photo.url} 
              alt={`Vehicle photo ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            {getScoreBadge(photo.url)}
          </div>
        ))}
      </div>
      
      {aiCondition && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${getConditionColor(aiCondition.condition)}`}>
                {aiCondition.condition || 'Unknown'} Condition
              </Badge>
              <span className="text-sm text-gray-500">
                {Math.round(aiCondition.confidenceScore)}% confidence
              </span>
            </div>
            {photoScore !== null && (
              <Badge variant="outline" className="bg-primary/10">
                Overall Score: {Math.round(photoScore * 100)}%
              </Badge>
            )}
          </div>
          
          {aiCondition.aiSummary && (
            <p className="text-sm text-gray-700">{aiCondition.aiSummary}</p>
          )}
          
          {aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Issues detected:</p>
              <ScrollArea className="h-24 w-full rounded-md border p-2">
                <ul className="text-sm space-y-1">
                  {aiCondition.issuesDetected.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRemove}
          disabled={isUploading || isScoring}
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove All Photos
        </Button>
      </div>
    </div>
  );
}
