import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useValuationContext } from '@/contexts/ValuationContext';

export function RerunValuationButton() {
  const { valuationData } = useValuationContext();
  const [isRerunning, setIsRerunning] = useState(false);

  const handleRerun = async () => {
    if (!valuationData) return;

    setIsRerunning(true);
    try {
      // Rerun functionality would require storing the original input data
      // For now, we'll disable this feature since the engine result doesn't contain
      // the original input parameters needed for rerunning
    } finally {
      setIsRerunning(false);
    }
  };

  // Disable rerun button for now since we don't have access to original input data
  const canRerun = false;

  if (!canRerun) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleRerun}
        disabled={isRerunning}
        size="lg"
        className="shadow-lg hover:shadow-xl transition-shadow"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRerunning ? 'animate-spin' : ''}`} />
        {isRerunning ? 'Rerunning...' : 'Update Valuation'}
      </Button>
    </div>
  );
}