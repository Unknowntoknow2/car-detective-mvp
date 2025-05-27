
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AICondition } from '@/types/photo';
import { Camera, Upload, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PhotoViewProps {
  photoUrl?: string;
  photoScore?: number;
  explanation?: string;
  condition?: AICondition;
  onPhotoUpload?: () => void;
}

export default function PhotoView({ 
  photoUrl, 
  photoScore, 
  explanation, 
  condition,
  onPhotoUpload 
}: PhotoViewProps) {
  
  // If no photo is available, show upload prompt
  if (!photoUrl) {
    return (
      <Card className="p-6 text-center bg-muted/20 border-dashed">
        <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Vehicle Photos Available</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload photos of your vehicle for AI condition assessment and more accurate valuation.
        </p>
        {onPhotoUpload && (
          <Button onClick={onPhotoUpload} variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Vehicle Photos
          </Button>
        )}
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Photos are sourced from real uploads only - no stock images are used</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Camera className="h-4 w-4 mr-2" />
        Vehicle Photo Assessment
      </h3>
      
      <Card className="overflow-hidden">
        <div className="relative">
          <img 
            src={photoUrl} 
            alt="Vehicle" 
            className="w-full h-auto object-cover max-h-80"
          />
          
          {condition && (
            <div className="absolute top-2 right-2">
              <Badge 
                className={`${getConditionColor(condition.condition)}`}
              >
                {condition.condition || 'Good'} Condition
              </Badge>
            </div>
          )}
        </div>
        
        {explanation && (
          <div className="p-3 bg-slate-50 border-t">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">AI Analysis:</p>
                <p className="text-sm text-gray-600">{explanation}</p>
              </div>
            </div>
          </div>
        )}
        
        {condition?.issuesDetected && condition.issuesDetected.length > 0 && (
          <div className="p-3 border-t">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Issues Detected:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {condition.issuesDetected.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// Helper function to get color based on condition
function getConditionColor(condition: string | null): string {
  switch(condition?.toLowerCase()) {
    case 'excellent':
      return 'bg-green-500 hover:bg-green-600';
    case 'good':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'fair':
      return 'bg-amber-500 hover:bg-amber-600';
    case 'poor':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-slate-500 hover:bg-slate-600';
  }
}
