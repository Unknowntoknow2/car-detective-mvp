
// For the aiCondition property, ensure issuesDetected has a default empty array:
aiCondition: valuationResult.aiCondition || {
  condition: valuationResult.condition || 'Unknown',
  confidenceScore: valuationResult.confidenceScore || 75,
  issuesDetected: [], // Default empty array instead of undefined
  summary: `Vehicle is in ${valuationResult.condition || 'average'} condition.`
},

// Do the same for the second occurrence
aiCondition: valuationResult.aiCondition || {
  summary: typeof valuationResult.condition === 'string' ? valuationResult.condition : '',
  condition: typeof valuationResult.condition === 'string' ? valuationResult.condition : '',
  confidenceScore: valuationResult.confidenceScore || 0,
  issuesDetected: [] // Default empty array
}
