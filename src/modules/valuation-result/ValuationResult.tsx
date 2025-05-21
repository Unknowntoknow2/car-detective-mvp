
import React from 'react';

interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string;
  percentAdjustment?: number;
}

interface ValuationResultProps {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments?: ValuationAdjustment[];
  baseValue?: number;
  explanation?: string;
  isPremium?: boolean;
  loadingPdf?: boolean;
  onDownloadPdf?: () => void;
  showLock?: boolean;
  isUnlocking?: boolean;
  onUnlock?: () => void;
}

export function ValuationResult({
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments = [],
  baseValue = 0,
  explanation,
  isPremium = false,
  loadingPdf = false,
  onDownloadPdf,
  showLock = false,
  isUnlocking = false,
  onUnlock
}: ValuationResultProps) {
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // Calculate total adjustments
  const totalAdjustmentAmount = adjustments.reduce((sum: number, adj: ValuationAdjustment) => sum + adj.impact, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Estimated Value</h2>
          <div className="flex items-baseline mb-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(estimatedValue)}
            </span>
            {isPremium && (
              <span className="ml-2 text-sm px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Price range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
          </p>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium">Confidence Score</h3>
              <span className="text-sm font-medium">{confidenceScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on available data and market conditions
            </p>
          </div>
          
          {onDownloadPdf && (
            <div className="mt-6">
              <button
                onClick={onDownloadPdf}
                disabled={loadingPdf}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded flex items-center justify-center"
              >
                {loadingPdf ? 'Generating PDF...' : 'Download Valuation Report'}
              </button>
            </div>
          )}
          
          {showLock && onUnlock && (
            <div className="mt-4">
              <button
                onClick={onUnlock}
                disabled={isUnlocking}
                className="w-full py-2 px-4 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded flex items-center justify-center"
              >
                {isUnlocking ? 'Processing...' : 'Unlock Premium Features'}
              </button>
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-3">Value Breakdown</h2>
          {baseValue > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span>Base Value</span>
              <span className="font-medium">{formatCurrency(baseValue)}</span>
            </div>
          )}
          
          {adjustments.length > 0 ? (
            <div className="space-y-2 mt-2">
              {adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between py-1 text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{adjustment.factor}</span>
                    {adjustment.description && (
                      <p className="text-xs text-gray-500">{adjustment.description}</p>
                    )}
                  </div>
                  <span className={adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {adjustment.impact >= 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                  </span>
                </div>
              ))}
              
              <div className="flex justify-between py-2 border-t mt-2 font-medium">
                <span>Total Adjustments</span>
                <span className={totalAdjustmentAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {totalAdjustmentAmount >= 0 ? '+' : ''}{formatCurrency(totalAdjustmentAmount)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 my-4">No price adjustments available.</p>
          )}
          
          {explanation && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Why this price?</h3>
              <p className="text-sm text-gray-600">{explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
