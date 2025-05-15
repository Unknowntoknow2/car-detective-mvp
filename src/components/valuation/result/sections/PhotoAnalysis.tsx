
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Camera, ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PhotoAnalysisProps {
  photoUrl?: string;
  photoScore?: number;
  condition?: any;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({
  photoUrl,
  photoScore,
  condition,
  isPremium,
  onUpgrade
}) => {
  // Sample condition data if none provided
  const sampleCondition = {
    exterior: { score: 8.5, notes: 'Minor wear, good paint condition' },
    interior: { score: 9.2, notes: 'Well-maintained interior, minimal wear' },
    mechanical: { score: 7.8, notes: 'Good mechanical condition, regular maintenance' },
  };
  
  const displayCondition = condition || sampleCondition;
  
  // Format condition score to display
  const formatScore = (score: number) => {
    return Math.round(score * 10) / 10;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg">Vehicle Condition Analysis</CardTitle>
      </CardHeader>
      <CardContent className="py-4 relative">
        {/* Photo Display */}
        <div className="aspect-video bg-muted/50 rounded-md overflow-hidden mb-4 flex items-center justify-center">
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt="Vehicle" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No vehicle photos available</p>
            </div>
          )}
        </div>
        
        {/* Photo Upload Button for non-premium users */}
        {!isPremium && (
          <Button variant="outline" className="w-full mb-4 gap-2" disabled>
            <Camera className="h-4 w-4" />
            Upload Photos
          </Button>
        )}
        
        {isPremium ? (
          <div className="space-y-4">
            {photoScore !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Photo Quality Score</p>
                  <p className="text-sm font-semibold">{photoScore}%</p>
                </div>
                <Progress value={photoScore} className="h-2" />
              </div>
            )}
            
            {/* Condition Analysis */}
            <div className="space-y-4 mt-6">
              <h4 className="font-medium">Condition Assessment</h4>
              {Object.entries(displayCondition).map(([key, value]: [string, any]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <span className="font-medium">{formatScore(value.score)}/10</span>
                  </div>
                  <Progress 
                    value={value.score * 10} 
                    className="h-2" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">{value.notes}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="blur-sm pointer-events-none">
            <div className="space-y-4">
              {/* Sample Photo Score */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Photo Quality Score</p>
                  <p className="text-sm font-semibold">82%</p>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              
              {/* Sample Condition Analysis */}
              <div className="space-y-4 mt-6">
                <h4 className="font-medium">Condition Assessment</h4>
                {Object.entries(sampleCondition).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span className="font-medium">{formatScore(value.score)}/10</span>
                    </div>
                    <Progress value={value.score * 10} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{value.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Premium Overlay */}
        {!isPremium && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <Lock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold mb-1">Premium Feature</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Unlock AI-powered condition analysis
              </p>
              <Button onClick={onUpgrade}>
                Upgrade to Premium
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoAnalysis;
