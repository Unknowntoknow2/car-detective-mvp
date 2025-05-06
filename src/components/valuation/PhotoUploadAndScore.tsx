
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudUpload, Camera, Loader2, X, Check, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { usePhotoScoring } from '@/hooks/usePhotoScoring';
import { toast } from 'sonner';
import { MIN_FILES, MAX_FILES } from '@/types/photo';
import { AIConditionDisplay } from './photo-upload/AIConditionDisplay';

interface PhotoUploadAndScoreProps {
  valuationId: string;
  onScoreChange?: (score: number, aiCondition?: any) => void;
  isPremium?: boolean;
}

export function PhotoUploadAndScore({ 
  valuationId, 
  onScoreChange,
  isPremium = false 
}: PhotoUploadAndScoreProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const {
    uploadPhotos,
    photos,
    photoScore,
    aiCondition,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload,
    individualScores,
    isLoading
  } = usePhotoScoring(valuationId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length < MIN_FILES) {
        toast.error(`Please select at least ${MIN_FILES} photos of your vehicle`);
        return;
      }
      
      if (e.target.files.length > MAX_FILES) {
        toast.error(`You can only upload up to ${MAX_FILES} photos`);
        return;
      }
      
      await handleUpload(Array.from(e.target.files));
    }
  };

  const handleUpload = async (files: File[]) => {
    const result = await uploadPhotos(files);
    
    if (result) {
      if (onScoreChange) {
        onScoreChange(result.score, result.aiCondition);
      }
      
      // Show toast notification based on AI condition confidence
      if (result.aiCondition && result.aiCondition.confidenceScore >= 70) {
        toast.success(`Vehicle condition assessed: ${result.aiCondition.condition}`);
      } else if (result.aiCondition) {
        toast.warning(`AI couldn't confidently assess condition. Consider uploading clearer photos.`);
      }
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files.length < MIN_FILES) {
        toast.error(`Please select at least ${MIN_FILES} photos of your vehicle`);
        return;
      }
      
      if (e.dataTransfer.files.length > MAX_FILES) {
        toast.error(`You can only upload up to ${MAX_FILES} photos`);
        return;
      }
      
      await handleUpload(Array.from(e.dataTransfer.files));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleReset = async () => {
    await resetUpload();
    if (onScoreChange) {
      onScoreChange(0);
    }
  };

  const isComplete = photos.length > 0 && !isLoading;

  return (
    <Card className={`border ${dragActive ? 'border-primary border-dashed' : 'border-border'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Photo Assessment
          {isPremium && (
            <span className="ml-2 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              Premium
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Upload photos of your vehicle to get an AI-powered condition assessment
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isUploading || isScoring ? (
          <div className="space-y-4 py-6">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-center text-sm font-medium">
              {isUploading ? 'Uploading photos...' : 'Analyzing vehicle condition...'}
            </p>
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-center text-xs text-muted-foreground">
              {isUploading ? 'Uploading your photos' : 'Our AI is analyzing your vehicle photos'}
            </p>
          </div>
        ) : isComplete ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Photo Analysis Complete</p>
                <p className="text-sm text-muted-foreground">
                  {photos.length} photo{photos.length !== 1 ? 's' : ''} analyzed
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            
            {photoScore !== null && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Photo Quality Score</p>
                  <span className={`text-sm font-bold ${photoScore >= 0.7 ? 'text-green-600' : photoScore >= 0.5 ? 'text-amber-600' : 'text-red-600'}`}>
                    {Math.round(photoScore * 100)}%
                  </span>
                </div>
                <Progress 
                  value={photoScore * 100} 
                  className={`mt-1 ${photoScore >= 0.7 ? 'bg-green-100' : photoScore >= 0.5 ? 'bg-amber-100' : 'bg-red-100'}`}
                />
              </div>
            )}
            
            {aiCondition && (
              <AIConditionDisplay aiCondition={aiCondition} photoScore={photoScore} />
            )}
            
            {individualScores && individualScores.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-4">
                {individualScores.map((score, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={score.url} 
                      alt={`Vehicle photo ${index + 1}`} 
                      className="w-full h-auto rounded-md aspect-square object-cover border"
                    />
                    <span 
                      className={`absolute top-1 right-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        score.score >= 0.7 ? 'bg-green-500 text-white' : 
                        score.score >= 0.5 ? 'bg-amber-500 text-white' : 
                        'bg-red-500 text-white'
                      }`}
                    >
                      {Math.round(score.score * 100)}%
                    </span>
                    {score.isPrimary && (
                      <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        Best
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error uploading photos</p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className={`border-2 rounded-lg p-6 text-center ${
              dragActive ? 'border-primary border-dashed bg-primary/5' : 'border-dashed border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            
            <CloudUpload className="h-10 w-10 mx-auto text-muted-foreground/50" />
            
            <h3 className="mt-4 text-lg font-medium">
              Drag photos here or click to upload
            </h3>
            
            <p className="mt-2 text-sm text-muted-foreground">
              Upload {MIN_FILES}-{MAX_FILES} photos of your vehicle from different angles
            </p>
            
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <Check className="h-4 w-4" /> Front view
              <Check className="h-4 w-4" /> Side view
              <Check className="h-4 w-4" /> Rear view
              <Check className="h-4 w-4" /> Interior
            </div>
            
            <Button 
              className="mt-6" 
              type="button" 
              onClick={triggerFileInput}
            >
              Select Photos
            </Button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
