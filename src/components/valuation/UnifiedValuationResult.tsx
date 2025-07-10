
import React from 'react';
import { ValuationResultCard } from '@/components/valuation/ValuationResultCard';
import type { ValuationResult } from '@/utils/valuation/unifiedValuationEngine';

interface UnifiedValuationResultProps {
  result: ValuationResult;
}

export const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  result
}) => {
  const handleDownloadPdf = () => {
    console.log('Download PDF clicked - feature coming soon');
  };

  const handleShareReport = () => {
    console.log('Share report clicked - feature coming soon');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ValuationResultCard 
        result={result}
        onDownloadPdf={handleDownloadPdf}
        onShareReport={handleShareReport}
      />
    </div>
  );
};

export default UnifiedValuationResult;
