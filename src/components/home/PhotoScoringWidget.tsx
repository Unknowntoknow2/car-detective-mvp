
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Check, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

export function PhotoScoringWidget() {
  const [photos, setPhotos] = useState<PhotoScore[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    // Preview files
    const newPhotos: PhotoScore[] = [];
    const files = Array.from(event.target.files).slice(0, 3); // Limit to 3 photos for demo
    
    for (const file of files) {
      const url = URL.createObjectURL(file);
      newPhotos.push({
        url,
        score: 0,
      });
    }
    
    setPhotos(newPhotos);
    analyzePhotos(newPhotos);
  };

  const analyzePhotos = async (photosList: PhotoScore[]) => {
    setIsAnalyzing(true);
    
    // Simulate API call to analyze photos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random scores for demo purposes
    const scoredPhotos = photosList.map((photo, index) => {
      // Generate scores between 65 and 95
      const score = Math.floor(Math.random() * 31) + 65;
      return {
        ...photo,
        score,
        isPrimary: index === 0, // Mark first photo as primary for this demo
      };
    });
    
    // Calculate overall score (average)
    const avgScore = scoredPhotos.reduce((sum, photo) => sum + photo.score, 0) / scoredPhotos.length;
    
    setPhotos(scoredPhotos);
    setOverallScore(Math.round(avgScore));
    setIsAnalyzing(false);
    
    toast.success("Photos analyzed successfully!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-500 text-white";
    if (score >= 70) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  const getConditionText = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  return (
    <Card className="w-full shadow-md border-muted-foreground/20">
      <CardHeader className="bg-surface-light pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Camera className="h-5 w-5 text-primary" />
          <span>AI Photo Scoring</span>
          <Badge variant="outline" className="ml-2 bg-primary-light/20">Premium</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Our AI analyzes your vehicle photos to verify condition and optimize value
        </p>
      </CardHeader>
      
      <CardContent className="p-4">
        {photos.length === 0 ? (
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary-light/30 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium mb-2">Upload vehicle photos for AI analysis</p>
            <p className="text-xs text-muted-foreground mb-4">Get an instant condition assessment</p>
            <Button className="relative" variant="outline" size="sm">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              Select Photos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {isAnalyzing ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm font-medium">Analyzing photos...</p>
                <p className="text-xs text-muted-foreground">Our AI is evaluating your vehicle's condition</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Overall Condition</span>
                  <Badge className={getScoreColor(overallScore)}>
                    {getConditionText(overallScore)} ({overallScore}/100)
                  </Badge>
                </div>
                <Progress value={overallScore} className="h-2 mb-4" />
                
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden border border-muted">
                        <img 
                          src={photo.url} 
                          alt={`Vehicle preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className={`absolute bottom-0 left-0 right-0 ${getScoreColor(photo.score)} text-xs px-2 py-1 flex items-center justify-between`}>
                        {photo.isPrimary && <Check className="h-3 w-3" />}
                        <span>{photo.score}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted/20 rounded-md p-3 mt-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      {overallScore >= 70 ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">AI Assessment</p>
                      <p className="text-xs text-muted-foreground">
                        {overallScore >= 85 ? (
                          "Your vehicle appears to be in excellent condition with minimal wear."
                        ) : overallScore >= 70 ? (
                          "Your vehicle shows normal wear for its age, in good overall condition."
                        ) : (
                          "Your vehicle shows signs of wear that may impact value. Consider addressing visible issues."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
