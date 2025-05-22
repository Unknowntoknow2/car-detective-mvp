import { AICondition } from '@/types/photo';

/**
 * Enhances the AI condition analysis with additional formatting and safety checks.
 * @param aiCondition The AI condition object to enhance.
 * @returns An enhanced AI condition object with formatted data.
 */
export const enhanceConditionAnalysis = (aiCondition: AICondition | null): AICondition | null => {
  if (!aiCondition) {
    return null;
  }

  const { condition, confidenceScore, issuesDetected, summary } = aiCondition;

  // Format the confidence score to a percentage
  const formattedConfidence = confidenceScore ? `${(confidenceScore * 100).toFixed(0)}%` : 'N/A';

  // Ensure issuesDetected is an array and trim each issue
  const identifiedIssues = issuesDetected?.map((issue: string) => {
    // Process each issue
    return issue.trim();
  }) || [];

  // Construct a more descriptive summary if one doesn't exist
  const enhancedSummary = summary || `The vehicle is in ${condition} condition with a confidence of ${formattedConfidence}.`;

  return {
    condition,
    confidenceScore,
    issuesDetected: identifiedIssues,
    summary: enhancedSummary,
  };
};
