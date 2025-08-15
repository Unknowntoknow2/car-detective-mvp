
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Sparkles } from 'lucide-react';
import { AICondition } from '@/types/photo';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange: (score: number, condition?: AICondition) => void;
  isPremium: boolean;
  formData?: any;
  hasPhotos?: boolean;
  onUploadClick?: () => void;
}

export const PhotoUploadAndScore: React.FC<PhotoUploadAndScoreProps> = ({
  valuationId,
  onScoreChange,
  isPremium,
  hasPhotos = false,
  onUploadClick
}) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Photo Analysis
          </span>
          {isPremium && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasPhotos ? (
          <div className="text-center space-y-4">
            <div className="p-8 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
              <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-primary">Upload Photos for AI Analysis</p>
              <p className="text-sm text-muted-foreground mt-1">
                Get precise condition scoring and value adjustments
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="space-y-1">
                <p className="font-medium">Recommended Photos:</p>
                <ul className="space-y-0.5">
                  <li>• Front exterior view</li>
                  <li>• Interior dashboard</li>
                  <li>• VIN plate/sticker</li>
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Additional Photos:</p>
                <ul className="space-y-0.5">
                  <li>• Rear exterior view</li>
                  <li>• Engine bay</li>
                  <li>• Tire condition</li>
                </ul>
              </div>
            </div>

            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="text-sm">
                <p className="font-medium text-success">Industry-Leading Accuracy</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Our AI analyzes vehicle condition with 94% accuracy, often matching professional appraisals
                </p>
              </div>
            </div>

            {onUploadClick && (
              <Button 
                onClick={onUploadClick}
                className="w-full"
                size="lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos for AI Analysis
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="p-6 bg-success/10 border border-success/20 rounded-lg">
              <Sparkles className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="font-medium text-success">Photos Analyzed Successfully</p>
              <p className="text-sm text-muted-foreground">
                AI condition scoring has been applied to your valuation
              </p>
            </div>
          </div>
        )}

        {!isPremium && (
          <div className="bg-muted/50 border rounded-lg p-3">
            <div className="text-sm text-center">
              <p className="font-medium">Upgrade for AI Photo Analysis</p>
              <p className="text-xs text-muted-foreground mt-1">
                Get precise condition scoring and value adjustments with Premium
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
