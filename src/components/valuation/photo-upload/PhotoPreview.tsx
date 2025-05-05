
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ConditionBadge } from '@/components/ui/condition-badge';

interface PhotoPreviewProps {
  photos: { url: string; thumbnail?: string }[];
  photoScore: number | null;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  isUploading: boolean;
  isScoring: boolean;
  uploadProgress: number;
  onRemove: () => void;
}

export function PhotoPreview({
  photos,
  photoScore,
  aiCondition,
  isUploading,
  isScoring,
  uploadProgress,
  onRemove
}: PhotoPreviewProps) {
  if (!photos.length) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Uploaded Photos</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={isUploading || isScoring}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-video rounded-md overflow-hidden">
            <img 
              src={photo.thumbnail || photo.url} 
              alt={`Vehicle photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {(isUploading || isScoring) && (
        <div className="p-4 border-t bg-slate-50">
          <p className="text-sm font-medium mb-2">
            {isUploading ? 'Uploading photos...' : 'Analyzing vehicle condition...'}
          </p>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {!isUploading && !isScoring && photoScore && (
        <div className="p-4 border-t">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">AI Analysis Results</h4>
              {aiCondition && (
                <ConditionBadge 
                  condition={aiCondition.condition} 
                  confidenceScore={aiCondition.confidenceScore}
                />
              )}
            </div>
            
            {aiCondition && (
              <div className="text-sm text-gray-600">
                {aiCondition.aiSummary}
              </div>
            )}
          </div>

          {aiCondition && aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
            <div className="mt-4 mb-2">
              <h5 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Detected Issues
              </h5>
              <ul className="text-sm space-y-1 pl-6 list-disc text-gray-600">
                {aiCondition.issuesDetected.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Trust Score:</div>
              <div className={`text-sm font-bold ${
                aiCondition && aiCondition.confidenceScore >= 90 ? 'text-green-600' :
                aiCondition && aiCondition.confidenceScore >= 80 ? 'text-blue-600' :
                aiCondition && aiCondition.confidenceScore >= 70 ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {aiCondition?.confidenceScore || 0}%
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-slate-100">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-slate-600">AI Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
