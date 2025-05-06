
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface ExplanationSectionProps {
  explanation: string;
  loading: boolean;
  error: string;
  onRegenerate: () => void;
}

export const ExplanationSection: React.FC<ExplanationSectionProps> = ({
  explanation,
  loading,
  error,
  onRegenerate,
}) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Why this price?</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRegenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Explanation
            </>
          )}
        </Button>
      </div>
      
      {loading ? (
        <p className="italic text-gray-500">Generating explanation...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="mb-6 whitespace-pre-wrap">{explanation}</p>
      )}
    </div>
  );
};
