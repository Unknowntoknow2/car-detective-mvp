// @ts-nocheck
import React from 'react';
import { ValuationResult } from '@/components/valuation/valuation-core/ValuationResult';

interface ValuationResultsProps {
  valuation: ValuationResult;
}

export function ValuationResults({ valuation }: ValuationResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount ?? 0);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  };

  const getConfidenceColor = (confidence: number) => {
    if ((confidence ?? 0) >= 80) return 'text-green-600 bg-green-100';
    if ((confidence ?? 0) >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAdjustmentColor = (percentage: number) => {
    if ((percentage ?? 0) > 0) return 'text-green-600';
    if ((percentage ?? 0) < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Valuation Report</h1>
          <p className="text-gray-600">
            {valuation.vehicleData?.year} {valuation.vehicleData?.make} {valuation.vehicleData?.model}
            {valuation.vehicleData?.trim && ` ${valuation.vehicleData?.trim}`}
          </p>
          <p className="text-sm text-gray-500">VIN: {valuation.vehicleData?.vin}</p>
        </div>

        {/* Main Valuation */}
        <div className="mt-8 text-center">
          <div className="inline-block p-6 bg-blue-50 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Estimated Market Value</h2>
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {formatCurrency(valuation.estimated_value)}
            </div>
            <div className="text-lg text-gray-600">
              Range: {formatCurrency(valuation.priceRange?.low)} - {formatCurrency(valuation.priceRange?.high)}
            </div>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-3 ${getConfidenceColor(
                valuation.confidence
              )}`}
            >
              {valuation.confidence}% Confidence
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Mileage:</strong> {valuation.vehicleData?.mileage?.toLocaleString() || 'N/A'}
          </div>
          <div>
            <strong>Condition:</strong> {String(valuation.vehicleData?.condition ?? 'N/A')}
          </div>
          <div>
            <strong>Title Status:</strong> {String(valuation.vehicleData?.titleStatus ?? 'N/A')}
          </div>
          <div>
            <strong>Location:</strong> {valuation.vehicleData?.zipCode || 'N/A'}
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          AI Valuation Explanation
        </h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{valuation.explanation}</p>
        </div>
      </div>

      {/* Valuation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adjustments */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Price Adjustments</h3>
          {Array.isArray(valuation.adjustments) && valuation.adjustments.length > 0 ? (
            <div className="space-y-3">
              {valuation.adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <div className="font-medium">{String(adjustment.factor ?? '')}</div>
                    <div className="text-sm text-gray-600">{String(adjustment.explanation ?? '')}</div>
                  </div>
                  <div className={`font-semibold ${getAdjustmentColor(adjustment.percentage)}`}>
                    {adjustment.percentage > 0 ? '+' : ''}
                    {(adjustment.percentage ?? 0).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No significant adjustments applied</p>
          )}
        </div>

        {/* Market Factors */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Market Factors</h3>
          {Array.isArray(valuation.marketFactors) && valuation.marketFactors.length > 0 ? (
            <div className="space-y-3">
              {valuation.marketFactors.map((factor, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <div className="font-medium">{factor.factor}</div>
                    <div className="text-sm text-gray-600">{factor.description}</div>
                  </div>
                  <div className={`font-semibold ${getAdjustmentColor((factor.impact ?? 0) * 100)}`}>
                    {factor.impact > 0 ? '+' : ''}
                    {(((factor.impact ?? 0) * 100)).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No specific market factors identified</p>
          )}
        </div>
      </div>

      {/* Accuracy Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Valuation Accuracy</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {valuation.accuracy?.comparableCount ?? 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Comparable Vehicles</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {valuation.accuracy?.dataQuality ?? 'N/A'}%
            </div>
            <div className="text-sm text-gray-600">Data Quality</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {valuation.accuracy?.marketCoverage ?? 'N/A'}%
            </div>
            <div className="text-sm text-gray-600">Market Coverage</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              ±{valuation.accuracy?.confidenceInterval ?? 'N/A'}%
            </div>
            <div className="text-sm text-gray-600">Confidence Interval</div>
          </div>
        </div>
      </div>

      {/* Comparable Vehicles */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Comparable Sales</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Vehicle</th>
                <th className="text-left p-2">Year</th>
                <th className="text-left p-2">Mileage</th>
                <th className="text-left p-2">Condition</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Listed</th>
                <th className="text-left p-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {(valuation.comparables ?? []).slice(0, 10).map((comp, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">
                      {comp.make} {comp.model}
                    </div>
                    {comp.trim && <div className="text-gray-500 text-xs">{comp.trim}</div>}
                  </td>
                  <td className="p-2">{comp.year}</td>
                  <td className="p-2">{comp.mileage.toLocaleString()}</td>
                  <td className="p-2 capitalize">{String(comp.condition).replace('_', ' ')}</td>
                  <td className="p-2 font-semibold">{formatCurrency(comp.price)}</td>
                  <td className="p-2">{formatDate(comp.listingDate)}</td>
                  <td className="p-2">
                    <span className="inline-block px-2 py-1 bg-gray-200 rounded text-xs">
                      {comp.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(valuation.comparables?.length ?? 0) > 10 && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              Showing 10 of {valuation.comparables?.length ?? 0} comparable vehicles
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-6 text-center text-sm text-gray-600">
        <p>Report generated on {formatDate(valuation.timestamp)} by the AIN Valuation Engine</p>
        <p className="mt-2">
          This valuation is based on current market data and should be used for informational purposes only.
          Actual selling prices may vary based on local market conditions and vehicle-specific factors.
        </p>
      </div>
    </div>
  );
}
