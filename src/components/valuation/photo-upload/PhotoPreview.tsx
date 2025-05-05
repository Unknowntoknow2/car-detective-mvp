
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trash2, AlertCircle, Check } from "lucide-react";
import { ConditionBadge } from "@/components/ui/condition-badge";

interface PhotoPreviewProps {
  photos: {
    url: string;
    thumbnail?: string;
    id?: string;
  }[];
  photoScore: number | null;
  isUploading: boolean;
  isScoring: boolean;
  uploadProgress: number;
  onRemove: () => void;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="aspect-square rounded-md overflow-hidden border border-gray-200 relative group">
            <img 
              src={photo.thumbnail || photo.url} 
              alt={`Vehicle photo ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {(isUploading || isScoring) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex items-center">
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading photos...
                </>
              ) : (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing vehicle photos with AI...
                </>
              )}
            </p>
            <span className="text-xs text-gray-500">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1" />
        </div>
      )}

      {!isUploading && !isScoring && aiCondition && (
        <div className="border rounded-md p-4 bg-background">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">AI Condition Assessment</h4>
            <ConditionBadge 
              condition={aiCondition.condition}
              confidenceScore={aiCondition.confidenceScore}
            />
          </div>
          
          {aiCondition.aiSummary && (
            <p className="text-sm mb-3 text-gray-600">{aiCondition.aiSummary}</p>
          )}
          
          {aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
            <div className="space-y-1 mt-2">
              <p className="text-xs font-medium text-gray-600">Issues detected:</p>
              <ul className="text-xs list-disc pl-5 text-gray-600 space-y-1">
                {aiCondition.issuesDetected.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!isUploading && !isScoring && photoScore && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-sm">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} analyzed
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove All Photos
          </Button>
        </div>
      )}
    </div>
  );
}
