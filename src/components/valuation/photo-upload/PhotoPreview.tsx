
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, X } from 'lucide-react';

interface PhotoPreviewProps {
  photoUrl: string;
  thumbnailUrl: string | null;
  photoScore: number | null;
  isUploading: boolean;
  isScoring: boolean;
  uploadProgress: number;
  onRemove: () => void;
}

export function PhotoPreview({
  photoUrl,
  thumbnailUrl,
  photoScore,
  isUploading,
  isScoring,
  uploadProgress,
  onRemove
}: PhotoPreviewProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500 text-white';
    if (score >= 0.5) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };
  
  const formatScorePercentage = (score: number) => {
    return Math.round(score * 100);
  };
  
  return (
    <Card className="relative overflow-hidden">
      {isScoring && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-10">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Analyzing photo...</p>
        </div>
      )}
      
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={thumbnailUrl || photoUrl} 
          alt="Vehicle" 
          className="w-full h-full object-cover"
        />
        {photoScore !== null && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">Analysis Complete</span>
              </div>
              <Badge className={getScoreColor(photoScore)}>
                Score: {formatScorePercentage(photoScore)}%
              </Badge>
            </div>
          </div>
        )}
        
        <button 
          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition"
          onClick={onRemove}
          aria-label="Remove photo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {isUploading && (
        <div className="p-3">
          <p className="text-sm font-medium mb-1">Uploading...</p>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </Card>
  );
}
