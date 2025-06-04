<<<<<<< HEAD

import { AICondition, PhotoScore } from '@/types/photo';
import { supabase } from '@/integrations/supabase/client';

interface PhotoAnalysisResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
}

export async function analyzePhotos(photoUrls: string[], valuationId: string): Promise<PhotoAnalysisResult> {
  if (!photoUrls || photoUrls.length === 0) {
    throw new Error('No photos provided for analysis');
  }

  try {
    const { data, error } = await supabase.functions.invoke('score-image', {
      body: { photoUrls, valuationId }
    });

    if (error) {
      throw new Error(`Failed to analyze photos: ${error.message}`);
    }

    if (!data || !data.scores || !Array.isArray(data.scores)) {
      throw new Error('Invalid response from photo analysis service');
    }

    // Calculate overall score based on individual scores
    const scores = data.scores as { url: string; score: number }[];
    const overallScore = scores.length > 0 
      ? scores.reduce((sum, item) => sum + item.score, 0) / scores.length
      : 0;

    // Map to our PhotoScore type
    const individualScores: PhotoScore[] = scores.map(score => ({
      url: score.url,
      score: score.score,
      isPrimary: false,
      explanation: undefined
    }));

    return {
      overallScore,
      individualScores,
      aiCondition: data.aiCondition
=======
import { supabase } from "@/integrations/supabase/client";
import { AICondition, PhotoScore, PhotoScoringResult } from "@/types/photo";
import process from "node:process";

/**
 * Analyzes photos using the photo analysis edge function
 */
export async function analyzePhotos(
  photoUrls: string[],
  valuationId: string,
): Promise<PhotoScoringResult> {
  try {
    if (!photoUrls.length) {
      return {
        photoScore: 0,
        individualScores: [],
        score: 0,
        photoUrls: [],
        aiCondition: {
          condition: "Fair",
          confidenceScore: 0,
        },
      };
    }

    // Call the photo analysis edge function
    const { data, error } = await supabase.functions.invoke("score-image", {
      body: {
        photoUrls,
        valuationId,
      },
    });

    if (error) {
      console.error("Error analyzing photos:", error);
      return {
        photoScore: 0,
        individualScores: [],
        score: 0,
        photoUrls: photoUrls,
        aiCondition: {
          condition: "Fair",
          confidenceScore: 0,
        },
        error: error.message || "Failed to analyze photos", // Valid property now
      };
    }

    if (!data || !Array.isArray(data.scores)) {
      return {
        photoScore: 0,
        individualScores: [],
        score: 0,
        photoUrls: photoUrls,
        aiCondition: {
          condition: "Fair",
          confidenceScore: 0,
        },
        error: "Invalid response from photo analysis service", // Valid property now
      };
    }

    // Process the response data
    const result: PhotoScoringResult = {
      photoScore: data.score || 0,
      individualScores: data.scores.map((score: any) => ({
        url: score.url,
        score: score.score,
        isPrimary: score.isPrimary || false,
      })) || [],
      photoUrls: photoUrls,
      // Backward compatibility fields
      score: data.score || 0,
      bestPhotoUrl: data.bestPhotoUrl || data.scores[0]?.url || "",
      aiCondition: data.aiCondition as AICondition,
    };

    return result;
  } catch (error: any) {
    console.error("Error in analyzePhotos:", error);
    return {
      photoScore: 0,
      individualScores: [],
      score: 0,
      photoUrls: photoUrls,
      bestPhotoUrl: "",
      aiCondition: {
        condition: "Fair",
        confidenceScore: 0,
      },
      error: error.message || "Failed to analyze photos", // Valid property now
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    };
  } catch (err) {
    console.error('Error analyzing photos:', err);
    throw err;
  }
}
<<<<<<< HEAD
=======

export const uploadAndAnalyzePhotos = async (
  files: File[],
  valuationId: string,
): Promise<PhotoScoringResult> => {
  try {
    // Upload files to storage
    const uploadPromises = files.map(async (file) => {
      const filename = `${valuationId}/${
        Math.random().toString(36).substring(2)
      }-${file.name}`;
      const { data, error } = await supabase.storage
        .from("vehicle-photos")
        .upload(filename, file);

      if (error) throw error;

      const url =
        `${process.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;
      return url;
    });

    const photoUrls = await Promise.all(uploadPromises);

    // Analyze the photos
    return await analyzePhotos(photoUrls, valuationId);
  } catch (error: any) {
    console.error("Error in uploadAndAnalyzePhotos:", error);
    return {
      photoScore: 0,
      individualScores: [],
      score: 0,
      photoUrls: [],
      bestPhotoUrl: "",
      aiCondition: {
        condition: "Fair",
        confidenceScore: 0,
      },
      error: error.message || "Failed to upload and analyze photos", // Valid property now
    };
  }
};
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
