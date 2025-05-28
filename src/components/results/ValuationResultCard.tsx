
import React from 'react';
import { VehicleValuationResult } from '@/valuation/types';

interface ValuationResultCardProps {
  data: VehicleValuationResult;
}

export function ValuationResultCard({ data }: ValuationResultCardProps) {
  return (
    <div className="rounded-xl border p-6 shadow-sm space-y-4 bg-white">
      <div className="text-2xl font-semibold text-gray-900">Your Vehicle Valuation</div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-lg">
            <span className="text-gray-600">Base Value:</span>{' '}
            <span className="font-semibold">${data.baseValue.toLocaleString()}</span>
          </div>
          <div className="text-lg">
            <span className="text-gray-600">Adjusted Value:</span>{' '}
            <span className="font-bold text-green-600">${data.adjustedValue.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-lg">
            <span className="text-gray-600">Price Range:</span>{' '}
            <span className="font-semibold">
              ${data.priceRange[0].toLocaleString()} – ${data.priceRange[1].toLocaleString()}
            </span>
          </div>
          <div className="text-lg">
            <span className="text-gray-600">Confidence Score:</span>{' '}
            <span className="font-semibold text-blue-600">{data.confidenceScore}%</span>
          </div>
        </div>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
          View Penalty Breakdown
        </summary>
        <div className="mt-3 bg-gray-50 rounded-lg p-4">
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between">
              <span>Mileage Penalty:</span>
              <span className="text-red-600">-${data.penalties.mileagePenalty.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Condition Penalty:</span>
              <span className="text-red-600">-${data.penalties.conditionPenalty.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Accident Penalty:</span>
              <span className="text-red-600">-${data.penalties.accidentPenalty.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Auction Damage Penalty:</span>
              <span className="text-red-600">-${data.penalties.auctionDamagePenalty.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Owner History Penalty:</span>
              <span className="text-red-600">-${data.penalties.ownerPenalty.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>Service History Penalty:</span>
              <span className="text-red-600">-${data.penalties.servicePenalty.toLocaleString()}</span>
            </li>
          </ul>
        </div>
      </details>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Dealer Insights</h4>
        <div className="space-y-1 text-sm text-blue-800">
          <div className="flex justify-between">
            <span>Estimated Dealer Profit:</span>
            <span className="font-medium">${data.dealerInsights.estimatedDealerProfit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Dealer List Price:</span>
            <span className="font-medium">${data.dealerInsights.avgDealerListPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Dealer Margin:</span>
            <span className="font-medium">{data.dealerInsights.dealerMargin.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">Market Insights</h4>
        <div className="space-y-1 text-sm text-green-800">
          <div className="flex justify-between">
            <span>Average Marketplace Price:</span>
            <span className="font-medium">${data.marketInsights.avgMarketplacePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Auction Price:</span>
            <span className="font-medium">${data.marketInsights.avgAuctionPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Listing Count:</span>
            <span className="font-medium">{data.marketInsights.listingCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Price Variance:</span>
            <span className="font-medium">{data.marketInsights.priceVariance.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
