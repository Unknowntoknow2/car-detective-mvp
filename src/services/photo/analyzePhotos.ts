
export interface PhotoAnalysisResult {
  overallScore: number;
  individualScores: Array<{
    url: string;
    score: number;
    isPrimary: boolean;
    explanation: string;
    damageDetected?: string[];
    qualityIssues?: string[];
  }>;
  aiCondition: {
    condition: "Excellent" | "Good" | "Fair" | "Poor";
    confidence: number;
    description: string;
    damageAssessment?: {
      exterior: string[];
      interior: string[];
      mechanical: string[];
    };
  };
}

export async function analyzePhotos(photoUrls: string[], valuationId: string): Promise<PhotoAnalysisResult> {
  console.log(`🔍 Analyzing ${photoUrls.length} photos for valuation ${valuationId}`);
  
  if (!photoUrls || photoUrls.length === 0) {
    return {
      overallScore: 50,
      individualScores: [],
      aiCondition: {
        condition: "Fair",
        confidence: 30,
        description: "No photos provided for analysis"
      }
    };
  }

  try {
    // Call the OpenAI photo analysis edge function
    const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/analyze-photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY`
      },
      body: JSON.stringify({
        photoUrls,
        valuationId
      })
    });

    if (!response.ok) {
      console.error('❌ Photo analysis API failed:', response.status);
      return getFallbackAnalysis(photoUrls);
    }

    const result = await response.json();
    console.log(`✅ Photo analysis completed: Overall score ${result.overallScore}`);
    
    return result;

  } catch (error) {
    console.error('❌ Photo analysis error:', error);
    return getFallbackAnalysis(photoUrls);
  }
}

function getFallbackAnalysis(photoUrls: string[]): PhotoAnalysisResult {
  // Enhanced fallback with basic image validation
  const individualScores = photoUrls.map((url, index) => {
    let score = 70; // Base score
    let explanation = "Photo analysis unavailable - basic validation applied";
    const qualityIssues: string[] = [];
    
    // Basic URL validation
    if (!url || !url.startsWith('http')) {
      score = 20;
      qualityIssues.push("Invalid photo URL");
    } else {
      // Check file extension
      const hasImageExt = /\.(jpg|jpeg|png|webp)$/i.test(url);
      if (!hasImageExt) {
        score -= 15;
        qualityIssues.push("Unsupported image format");
      }
      
      // Assume first photo is primary
      if (index === 0) {
        score += 10;
        explanation = "Primary vehicle photo - good positioning assumed";
      }
    }
    
    return {
      url,
      score: Math.max(20, Math.min(90, score)),
      isPrimary: index === 0,
      explanation,
      qualityIssues: qualityIssues.length > 0 ? qualityIssues : undefined
    };
  });

  const overallScore = individualScores.reduce((sum, s) => sum + s.score, 0) / individualScores.length;
  
  let condition: "Excellent" | "Good" | "Fair" | "Poor";
  let confidence = 40; // Low confidence for fallback
  
  if (overallScore >= 80) {
    condition = "Good"; // Conservative estimate
  } else if (overallScore >= 60) {
    condition = "Fair";
  } else {
    condition = "Poor";
  }

  return {
    overallScore: Math.round(overallScore),
    individualScores,
    aiCondition: {
      condition,
      confidence,
      description: `Estimated condition based on ${photoUrls.length} photos. Professional analysis recommended.`
    }
  };
}
