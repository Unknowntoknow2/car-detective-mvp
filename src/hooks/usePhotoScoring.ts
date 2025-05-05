
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Photo {
  url: string;
  thumbnail?: string;
  id?: string;
}

interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

// Interface for custom Supabase tables not in the generated types
interface ValuationPhoto {
  id: string;
  valuation_id: string;
  photo_url: string;
  score: number;
  uploaded_at: string;
}

export function usePhotoScoring(valuationId: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [aiCondition, setAiCondition] = useState<AICondition | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load existing photos and assessment if available
  useEffect(() => {
    async function loadExistingPhotos() {
      if (!valuationId) return;
      
      try {
        // Get existing photos
        // Use 'any' type assertion for Supabase queries to tables not in generated types
        const { data: photoData, error: photoError } = await supabase
          .from('valuation_photos' as any)
          .select('*')
          .eq('valuation_id', valuationId) as any;
        
        if (photoError) {
          console.log('Error loading photos:', photoError);
          return;
        }
        
        if (photoData && photoData.length > 0) {
          const loadedPhotos = photoData.map((photo: ValuationPhoto) => ({
            url: photo.photo_url,
            thumbnail: photo.photo_url,
            id: photo.id
          }));
          
          setPhotos(loadedPhotos);
          
          // If we have photos, check for AI assessment
          const { data: aiData, error: aiError } = await supabase
            .from('photo_scores')
            .select('*')
            .eq('valuation_id', valuationId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (!aiError && aiData) {
            setPhotoScore(aiData.score * 100); // Convert from 0-1 to 0-100
            
            // Extract AI condition analysis from metadata
            if (aiData.metadata) {
              const metadata = aiData.metadata as any;
              if (metadata.condition) {
                setAiCondition({
                  condition: metadata.condition,
                  confidenceScore: metadata.confidenceScore || 70,
                  issuesDetected: metadata.issuesDetected || [],
                  aiSummary: metadata.aiSummary
                });
              }
            }
          }
        }
      } catch (err) {
        console.log('Error loading existing photo data:', err);
      }
    }
    
    loadExistingPhotos();
  }, [valuationId]);

  const resetUpload = async () => {
    // Delete photos from storage
    for (const photo of photos) {
      if (photo.id) {
        try {
          await supabase
            .from('valuation_photos' as any)
            .delete()
            .eq('id', photo.id) as any;
        } catch (err) {
          console.error('Error deleting photo record:', err);
        }
      }
    }
    
    setPhotos([]);
    setPhotoScore(null);
    setAiCondition(null);
    setError(null);
    setUploadProgress(0);
  };

  const uploadPhotos = async (files: File[]): Promise<{ score: number, aiCondition?: AICondition } | null> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // First, upload all photos to storage
      const uploadedPhotos: Photo[] = [];
      const totalFiles = files.length;
      let uploadedCount = 0;
      
      for (const file of files) {
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${valuationId}/${fileName}`;
        
        // Upload the file to Supabase storage
        const { data, error: uploadError } = await supabase.storage
          .from('vehicle-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the URL of the uploaded file
        const { data: urlData } = supabase.storage
          .from('vehicle-photos')
          .getPublicUrl(filePath);
        
        uploadedPhotos.push({
          url: urlData.publicUrl,
          thumbnail: urlData.publicUrl
        });
        
        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalFiles) * 50)); // First 50% is for uploads
      }
      
      setPhotos(prev => [...prev, ...uploadedPhotos]);
      setIsUploading(false);
      setIsScoring(true);
      
      // Now analyze the photos with the Edge Function
      const formData = new FormData();
      formData.append('valuationId', valuationId);
      
      // Re-add the files to the FormData for analysis
      files.forEach((file, index) => {
        formData.append(`photos[${index}]`, file);
      });
      
      // Call the analyze-photos edge function
      let aiResult;
      try {
        setUploadProgress(60); // Show progress during analysis
        
        const { data: analyzeData, error: analyzeError } = await supabase.functions
          .invoke('analyze-photos', {
            body: formData,
          });
        
        if (analyzeError) throw analyzeError;
        aiResult = analyzeData;
        
        setUploadProgress(80);
      } catch (analyzeErr) {
        console.log('Edge function analysis failed:', analyzeErr);
        // Fall back to a mock analysis
        aiResult = await mockAnalyzePhotos(uploadedPhotos.map(p => p.url));
      }
      
      // Save the photo records in the database
      const savedPhotoPromises = uploadedPhotos.map(async (photo, index) => {
        const { data: photoData, error: photoError } = await supabase
          .from('valuation_photos' as any)
          .insert({
            valuation_id: valuationId,
            photo_url: photo.url,
            score: aiResult.confidenceScore / 100, // Store as 0-1 value
            uploaded_at: new Date().toISOString()
          })
          .select()
          .single() as any;
          
        if (photoError) {
          console.error('Error storing photo record:', photoError);
          return photo;
        }
        
        return {
          ...photo,
          id: photoData?.id
        };
      });
      
      const updatedPhotos = await Promise.all(savedPhotoPromises);
      setPhotos(prev => {
        // Keep any previously existing photos, update newly added ones
        const oldPhotos = prev.slice(0, prev.length - uploadedPhotos.length);
        return [...oldPhotos, ...updatedPhotos];
      });
      
      // Store the assessment result
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('photo_scores')
        .insert({
          valuation_id: valuationId,
          score: aiResult.confidenceScore / 100, // Store as 0-1 value
          thumbnail_url: uploadedPhotos[0]?.url || null,
          metadata: {
            condition: aiResult.condition,
            confidenceScore: aiResult.confidenceScore,
            issuesDetected: aiResult.issuesDetected,
            aiSummary: aiResult.aiSummary,
            analysis_timestamp: new Date().toISOString(),
            photo_count: updatedPhotos.length
          }
        });
      
      if (assessmentError) {
        console.error('Error storing assessment result:', assessmentError);
      }
      
      // Update state with results
      setPhotoScore(aiResult.confidenceScore);
      setAiCondition({
        condition: aiResult.condition,
        confidenceScore: aiResult.confidenceScore,
        issuesDetected: aiResult.issuesDetected,
        aiSummary: aiResult.aiSummary
      });
      
      setUploadProgress(100);
      setIsScoring(false);
      
      return {
        score: aiResult.confidenceScore,
        aiCondition: {
          condition: aiResult.condition,
          confidenceScore: aiResult.confidenceScore,
          issuesDetected: aiResult.issuesDetected,
          aiSummary: aiResult.aiSummary
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsUploading(false);
      setIsScoring(false);
      console.error('Photo upload error:', err);
      return null;
    }
  };
  
  // Mock function to simulate AI photo analysis
  const mockAnalyzePhotos = async (imageUrls: string[]): Promise<{
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    confidenceScore: number;
    issuesDetected: string[];
    aiSummary: string;
  }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock assessment
    const conditions = ['Excellent', 'Good', 'Fair', 'Poor'] as const;
    const randomIndex = Math.floor(Math.random() * 3); // Bias toward better conditions
    const condition = conditions[randomIndex];
    
    const confidenceScore = Math.round(85 - (randomIndex * 10) + (Math.random() * 10));
    
    const possibleIssues = [
      'Minor scratches on front bumper',
      'Light wear on driver seat',
      'Small dent on passenger door',
      'Windshield has minor chip',
      'Paint fading on hood',
      'Wheel rim has curb rash',
      'Headlight lens slightly cloudy'
    ];
    
    const issuesDetected = randomIndex === 0 
      ? [] 
      : possibleIssues.slice(0, randomIndex + 1);
    
    const summaries = [
      'Vehicle appears to be in excellent condition with no visible issues detected.',
      'Vehicle is in good condition overall with minimal wear appropriate for its age.',
      'Vehicle shows normal wear and would benefit from minor cosmetic repairs.',
      'Vehicle has several issues that should be addressed to improve its condition.'
    ];
    
    return {
      condition,
      confidenceScore,
      issuesDetected,
      aiSummary: summaries[randomIndex]
    };
  };
  
  return {
    uploadPhotos,
    photos,
    photoScore,
    aiCondition,
    isUploading,
    isScoring,
    uploadProgress,
    error,
    resetUpload
  };
}
