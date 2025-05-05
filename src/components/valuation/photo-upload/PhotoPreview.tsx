
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, X, CheckCircle, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AIConditionDisplay } from './AIConditionDisplay';
import { Photo, AICondition } from '@/types/photo';

interface PhotoPreviewProps {
  photos: Photo[];
  photoScore: number | null;
  isUploading: boolean;
  isScoring: boolean;
  uploadProgress: number;
  onRemove: () => void;
  aiCondition: AICondition | null;
}

export function PhotoPreview({
  photos,
  photoScore,
  isUploading,
  isScoring,
  uploadProgress,
  onRemove,
  aiCondition
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
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square rounded-md overflow-hidden relative group border border-slate-200">
              <img
                src={photo.url}
                alt={`Vehicle photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {aiCondition && !isUploading && !isScoring && (
          <AIConditionDisplay aiCondition={aiCondition} photoScore={photoScore} />
        )}
      </div>
    </div>
  );
}
