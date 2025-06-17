
import { supabase } from "@/integrations/supabase/client";
import { AICondition, PhotoScore, PhotoScoringResult } from "@/types/photo";

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
        score: 0,
        analysis: {
          scores: [],
          overallScore: 0,
          recommendations: []
        },
        confidence: 0,
        photoUrls: [],
        individualScores: [],
        aiCondition: {
          confidence: 0,
          description: "Fair",
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
        score: 0,
        analysis: {
          scores: [],
          overallScore: 0,
          recommendations: []
        },
        confidence: 0,
        photoUrls: photoUrls,
        individualScores: [],
        aiCondition: {
          confidence: 0,
          description: "Fair",
        },
        error: error.message || "Failed to analyze photos",
      };
    }

    if (!data || !Array.isArray(data.scores)) {
      return {
        score: 0,
        analysis: {
          scores: [],
          overallScore: 0,
          recommendations: []
        },
        confidence: 0,
        photoUrls: photoUrls,
        individualScores: [],
        aiCondition: {
          confidence: 0,
          description: "Fair",
        },
        error: "Invalid response from photo analysis service",
      };
    }

    // Process the response data
    const result: PhotoScoringResult = {
      score: data.score || 0,
      analysis: {
        scores: data.scores || [],
        overallScore: data.score || 0,
        recommendations: data.recommendations || []
      },
      confidence: data.confidence || 0,
      individualScores: data.scores.map((score: any) => ({
        url: score.url,
        score: score.score,
        isPrimary: score.isPrimary || false,
        overall: score.score,
        clarity: score.clarity || score.score,
        angle: score.angle || score.score,
        lighting: score.lighting || score.score,
        condition: score.condition || score.score,
      })) || [],
      photoUrls: photoUrls,
      bestPhotoUrl: data.bestPhotoUrl || data.scores[0]?.url || "",
      aiCondition: data.aiCondition as AICondition,
    };

    return result;
  } catch (error: any) {
    console.error("Error in analyzePhotos:", error);
    return {
      score: 0,
      analysis: {
        scores: [],
        overallScore: 0,
        recommendations: []
      },
      confidence: 0,
      photoUrls: photoUrls,
      individualScores: [],
      bestPhotoUrl: "",
      aiCondition: {
        confidence: 0,
        description: "Fair",
      },
      error: error.message || "Failed to analyze photos",
    };
  }
}

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
      error: error.message || "Failed to upload and analyze photos",
    };
  }
};
