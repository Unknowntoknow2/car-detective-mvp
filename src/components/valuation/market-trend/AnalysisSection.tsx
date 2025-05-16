
import React from 'react';

interface AnalysisSectionProps {
  analysis: string;
  fallbackAnalysis: string;
}

export function AnalysisSection({ analysis, fallbackAnalysis }: AnalysisSectionProps) {
  return (
    <div className="mt-4 p-4 bg-muted/30 rounded-md">
      <h4 className="font-medium mb-2">Analysis</h4>
      <p className="text-sm text-muted-foreground">
        {analysis || fallbackAnalysis}
      </p>
    </div>
  );
}
