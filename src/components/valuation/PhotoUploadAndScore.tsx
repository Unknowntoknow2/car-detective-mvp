
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PhotoUploader } from './photo-upload/PhotoUploader';
import { getBestPhotoAssessment } from '@/services/valuationService';
import { AICondition } from '@/types/photo';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange?: (score: number, condition?: AICondition) => void;
  isPremium?: boolean;
}

export function PhotoUploadAndScore({
  valuationId,
  onScoreChange,
  isPremium = false
}: PhotoUploadAndScoreProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [bestPhotoUrl, setBestPhotoUrl] = useState<string | null>(null);
  const [aiCondition, setAiCondition] = useState<AICondition | null>(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  
  // Fetch existing photo assessment if available
  useEffect(() => {
    async function fetchPhotoData() {
      if (!valuationId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getBestPhotoAssessment(valuationId);
        
        if (result) {
          // Take the first photo as the best one for now
          const bestPhoto = result.photoScores.find(p => p.isPrimary) || result.photoScores[0];
          
          setPhotoScore(bestPhoto.score * 100);
          setBestPhotoUrl(bestPhoto.url);
          setAiCondition(result.aiCondition);
          setIsUploadComplete(true);
          
          // Call parent's callback
          if (onScoreChange) {
            onScoreChange(bestPhoto.score * 100, result.aiCondition);
          }
        }
      } catch (err) {
        console.error('Error fetching photo data:', err);
        // Don't set error state here, just log it
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPhotoData();
  }, [valuationId, onScoreChange]);
  
  const handleScoreUpdate = (score: number, bestPhoto?: string) => {
    setPhotoScore(score * 100);
    if (bestPhoto) setBestPhotoUrl(bestPhoto);
    setIsUploadComplete(true);
    
    // For demo purposes, generate a mock AI condition
    const mockAICondition: AICondition = {
      condition: score > 0.8 ? 'Excellent' : score > 0.6 ? 'Good' : score > 0.4 ? 'Fair' : 'Poor',
      confidenceScore: Math.round(score * 100),
      issuesDetected: score < 0.7 ? ['Minor scratches', 'Worn interior'] : [],
      aiSummary: score > 0.8 
        ? 'Vehicle appears to be in excellent condition with no visible issues.'
        : score > 0.6
        ? 'Vehicle is in good condition with minor cosmetic issues.'
        : score > 0.4
        ? 'Vehicle shows signs of wear and may need some repairs.'
        : 'Vehicle has significant wear and damage visible.'
    };
    
    setAiCondition(mockAICondition);
    
    // Call parent's callback
    if (onScoreChange) {
      onScoreChange(score * 100, mockAICondition);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Vehicle Photos</CardTitle>
            <CardDescription>
              Upload photos to improve valuation accuracy
            </CardDescription>
          </div>
          
          {isPremium && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Premium Feature
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Loading photo data...</p>
          </div>
        ) : isUploadComplete && photoScore !== null ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              {bestPhotoUrl ? (
                <div className="w-24 h-24 rounded-md overflow-hidden bg-muted">
                  <img 
                    src={bestPhotoUrl} 
                    alt="Vehicle" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-md overflow-hidden flex items-center justify-center bg-muted">
                  <Camera className="h-10 w-10 text-muted-foreground/50" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">Photo Quality Score</p>
                  <span className="text-sm font-medium">{Math.round(photoScore)}%</span>
                </div>
                <Progress value={photoScore} className="h-2 mb-2" />
                
                <div className="text-sm text-muted-foreground">
                  {photoScore > 80 ? (
                    <p className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Excellent photo quality
                    </p>
                  ) : photoScore > 60 ? (
                    <p>Good photo quality</p>
                  ) : (
                    <p className="text-yellow-600">Fair photo quality</p>
                  )}
                </div>
              </div>
            </div>
            
            {isPremium && aiCondition && (
              <div className="space-y-3 border-t border-border pt-4 mt-4">
                <h3 className="font-medium">AI Condition Assessment</h3>
                <div className="bg-primary/5 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Condition Rating</p>
                    <Badge 
                      variant="outline" 
                      className={
                        aiCondition.condition === 'Excellent' ? 'bg-green-50 text-green-700 border-green-200' :
                        aiCondition.condition === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        aiCondition.condition === 'Fair' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {aiCondition.condition}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <span className="text-xs font-medium">{aiCondition.confidenceScore}%</span>
                  </div>
                  <Progress value={aiCondition.confidenceScore} className="h-1.5 mb-3" />
                  
                  {aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Issues Detected:</p>
                      <ul className="text-xs text-muted-foreground list-disc list-inside">
                        {aiCondition.issuesDetected.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {aiCondition.aiSummary && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {aiCondition.aiSummary}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setIsUploadComplete(false)}
              className="mt-4"
            >
              Upload Different Photos
            </Button>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setError(null)}
                className="mt-2"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <PhotoUploader
            valuationId={valuationId}
            onScoreUpdate={handleScoreUpdate}
            isPremium={isPremium}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default PhotoUploadAndScore;
