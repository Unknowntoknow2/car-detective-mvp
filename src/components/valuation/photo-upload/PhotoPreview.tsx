
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, X, CheckCircle, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AIConditionDisplay } from './AIConditionDisplay';
import { Photo, AICondition } from '@/types/photo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PhotoPreviewProps {
  photos: Photo[];
  photoScore: number | null;
  isUploading: boolean;
  isScoring: boolean;
  uploadProgress: number;
  onRemove: () => void;
  aiCondition: AICondition | null;
  individualScores?: {url: string, score: number}[];
}

export function PhotoPreview({
  photos,
  photoScore,
  isUploading,
  isScoring,
  uploadProgress,
  onRemove,
  aiCondition,
  individualScores = []
}: PhotoPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-slate-500" />
            <h4 className="font-medium">Vehicle Photos ({photos.length})</h4>
          </div>
          
          {!isUploading && !isScoring && (
            <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
              <X className="h-4 w-4 mr-1" />
              Remove All
            </Button>
          )}
        </div>
        
        {(isUploading || isScoring) && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-600">
                {isUploading ? 'Uploading photos...' : 'Analyzing photos...'}
              </span>
              <span className="text-sm font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {photos.map((photo, index) => {
            // Find the score for this photo URL
            const matchingScore = individualScores.find(score => score.url === photo.url);
            const score = matchingScore ? matchingScore.score : null;
            
            return (
              <div key={index} className="aspect-square rounded-md overflow-hidden relative group border border-slate-200">
                <img
                  src={photo.url}
                  alt={`Vehicle photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {score !== null && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute bottom-0 right-0 m-1">
                          <Badge className={`text-xs ${getScoreColorClass(score)}`}>
                            {Math.round(score * 100)}%
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Condition score: {Math.round(score * 100)}%</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            );
          })}
        </div>
        
        {photoScore !== null && !isUploading && !isScoring && (
          <div className="mt-4 p-2 bg-slate-100 rounded border border-slate-200">
            <p className="text-sm font-medium text-slate-700">
              Overall condition score: <span className={getScoreTextColorClass(photoScore)}>{Math.round(photoScore * 100)}%</span>
              {individualScores.length > 0 && (
                <span className="text-xs text-slate-500 ml-2">
                  (Average of {individualScores.length} photos)
                </span>
              )}
            </p>
          </div>
        )}
        
        {aiCondition && !isUploading && !isScoring && (
          <AIConditionDisplay aiCondition={aiCondition} photoScore={photoScore} />
        )}
      </div>
    </div>
  );
}

function getScoreColorClass(score: number): string {
  if (score >= 0.8) return "bg-green-100 text-green-800";
  if (score >= 0.6) return "bg-emerald-100 text-emerald-800";
  if (score >= 0.4) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

function getScoreTextColorClass(score: number): string {
  if (score >= 0.8) return "text-green-600";
  if (score >= 0.6) return "text-emerald-600";
  if (score >= 0.4) return "text-yellow-600";
  return "text-red-600";
}
