import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, AlertCircle, Camera, Check } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PhotoUploadList } from './PhotoUploadList';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { PhotoScore, AICondition } from '@/types/photo';
import { MAX_FILES, MIN_FILES } from '@/types/photo';
import { Progress } from '@/components/ui/progress';

interface PhotoUploaderProps {
  valuationId: string;
  onScoreUpdate?: (score: number, bestPhoto?: string, aiCondition?: AICondition) => void;
  isPremium?: boolean;
}

export function PhotoUploader({ 
  valuationId,
  onScoreUpdate,
  isPremium = false
}: PhotoUploaderProps) {
  const [scoringComplete, setScoringComplete] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [bestPhotoUrl, setBestPhotoUrl] = useState<string>('');
  const [photoAssessment, setPhotoAssessment] = useState<AICondition | null>(null);
  
  const { 
    photos, 
    isUploading,
    error,
    handleFileSelect,
    uploadPhotos,
    removePhoto,
    addExplanation,
    createPhotoScores,
    analyzePhotos
  } = usePhotoUpload({
    valuationId: valuationId || ''
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileSelect(acceptedFiles);
  }, [handleFileSelect]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: MAX_FILES,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const simulateProgress = () => {
    // Simulate progress for better UX
    setAnalyzeProgress(0);
    const interval = setInterval(() => {
      setAnalyzeProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);
    
    return () => clearInterval(interval);
  };
  
  const handleAnalyzePhotos = async () => {
    const progressCleanup = simulateProgress();

    try {
      // First upload the photos
      await uploadPhotos();

      // Create initial scores
      const photoScores = createPhotoScores();
      
      // Find best photo (highest score)
      let bestScore = 0;
      let bestPhoto = '';
      
      photoScores.forEach(score => {
        if (score.score > bestScore) {
          bestScore = score.score;
          bestPhoto = score.url;
        }
      });
      
      // If we found a best photo, set it
      if (bestPhoto) {
        setBestPhotoUrl(bestPhoto);
      }
      
      // Now analyze photos for AI condition assessment
      const analysis = await analyzePhotos(photos.map(p => p.url!), valuationId);
      
      if (analysis && analysis.aiCondition) {
        setPhotoAssessment(analysis.aiCondition);
      }
      
      // Finalize progress
      setAnalyzeProgress(100);
      
      // Calculate average score from all photos
      const avgScore = photoScores.reduce((sum, item) => sum + item.score, 0) / photoScores.length;
      
      // Call parent's callback with the score
      if (onScoreUpdate) {
        onScoreUpdate(
          avgScore,
          bestPhoto,
          analysis?.aiCondition
        );
      }
      
      setScoringComplete(true);
    } catch (err) {
      console.error('Error analyzing photos:', err);
      setAnalyzeProgress(0);
    } finally {
      progressCleanup();
    }
  };
  
  return (
    <div className="space-y-4">
      {!scoringComplete && (
        <>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Camera className="h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium">
                Drag & drop your vehicle photos here
              </p>
              <p className="text-xs text-muted-foreground">
                Or click to browse (max {MAX_FILES} photos, 10MB each)
              </p>
            </div>
          </div>
          
          {photos.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <PhotoUploadList photos={photos} onRemove={removePhoto} />
                
                {analyzeProgress > 0 && analyzeProgress < 100 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing photos...</span>
                      <span>{analyzeProgress}%</span>
                    </div>
                    <Progress value={analyzeProgress} className="h-2" />
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={handleAnalyzePhotos}
                    disabled={isUploading || photos.length < MIN_FILES || analyzeProgress > 0}
                  >
                    {isUploading ? 'Uploading...' : analyzeProgress > 0 ? 'Analyzing...' : 'Analyze Photos'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
        </>
      )}
      
      {scoringComplete && (
        <Card className="bg-slate-50 border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 rounded-full p-1">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-700">
                Photo analysis complete! {isPremium ? 'Premium condition assessment included.' : ''}
              </p>
            </div>
            
            {bestPhotoUrl && (
              <div className="aspect-video relative bg-slate-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src={bestPhotoUrl} 
                  alt="Vehicle" 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            
            {photoAssessment && (
              <div className="bg-white rounded border p-3 text-sm">
                <p className="font-medium mb-1">AI Assessment:</p>
                <p>Condition: <span className="font-medium">{photoAssessment.condition}</span></p>
                {photoAssessment.issuesDetected && photoAssessment.issuesDetected.length > 0 && (
                  <p className="mt-1">Issues: {photoAssessment.issuesDetected.join(', ')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
