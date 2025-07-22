import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Share2 } from 'lucide-react';

interface ValuationActionsProps {
  onGeneratePDF: () => void;
  onShare: () => void;
}

export function ValuationActions({ onGeneratePDF, onShare }: ValuationActionsProps) {
  return (
    <div className="flex gap-3">
      <Button onClick={onGeneratePDF} variant="outline" className="flex-1">
        <FileText className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      <Button onClick={onShare} variant="outline" className="flex-1">
        <Share2 className="mr-2 h-4 w-4" />
        Share Results
      </Button>
    </div>
  );
}