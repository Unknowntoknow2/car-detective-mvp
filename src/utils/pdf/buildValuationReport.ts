
// Update the drawValuationSummary function call
// Original line: 
// yPosition = drawValuationSummary(sectionParams, reportData.narrative, yPosition);

// Change to include all required parameters:
yPosition = drawValuationSummary(
  sectionParams, 
  reportData.narrative || '', 
  yPosition,
  reportData.isPremium,
  true // includeTimestamp 
);
