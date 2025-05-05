
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, X, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Photo {
  url: string;
  thumbnail?: string;
}

interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

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
  const getConditionColor = (condition: string | null) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-500 text-white';
      case 'Good': return 'bg-blue-500 text-white';
      case 'Fair': return 'bg-yellow-500 text-white';
      case 'Poor': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 55) return "text-yellow-600";
    return "text-red-600";
  };
  
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
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className={getConditionColor(aiCondition.condition)}>
                  {aiCondition.condition || "Unknown"}
                </Badge>
                <span className={`text-sm font-medium ${getScoreColor(aiCondition.confidenceScore)}`}>
                  {aiCondition.confidenceScore}/100 Score
                </span>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            </div>
            
            {aiCondition.aiSummary && (
              <p className="text-sm text-slate-600 mt-1">{aiCondition.aiSummary}</p>
            )}
            
            {aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
              <div className="mt-3">
                <h5 className="text-xs font-medium text-slate-700 mb-1">Issues Detected:</h5>
                <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                  {aiCondition.issuesDetected.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
