
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CompetitorPrice, getCachedCompetitorPrices, calculateAverageCompetitorPrice } from '@/services/competitorPriceService';

interface CompetitorPriceComparisonProps {
  vin: string;
  estimatedValue: number;
  className?: string;
}

export const CompetitorPriceComparison: React.FC<CompetitorPriceComparisonProps> = ({
  vin,
  estimatedValue,
  className = ''
}) => {
  const [competitorPrices, setCompetitorPrices] = useState<CompetitorPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        const prices = await getCachedCompetitorPrices(vin);
        setCompetitorPrices(prices);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    if (vin) {
      fetchPrices();
    }
  }, [vin]);

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading competitor prices...</span>
        </div>
      </Card>
    );
  }

  if (!competitorPrices) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4">Competitor Price Comparison</h3>
        <p className="text-gray-600">No competitor pricing data available for this vehicle.</p>
      </Card>
    );
  }

  const averagePrice = calculateAverageCompetitorPrice(competitorPrices);
  const priceDifference = averagePrice ? estimatedValue - averagePrice : null;
  const percentageDifference = averagePrice ? ((priceDifference! / averagePrice) * 100) : null;

  const formatPrice = (price: string | null | undefined) => {
    if (!price || price === '0') return 'N/A';
    const numPrice = parseInt(price, 10);
    return isNaN(numPrice) ? 'N/A' : `$${numPrice.toLocaleString()}`;
  };

  const getTrendIcon = () => {
    if (!percentageDifference) return <Minus className="h-4 w-4" />;
    if (percentageDifference > 5) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (percentageDifference < -5) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendBadgeVariant = () => {
    if (!percentageDifference) return 'secondary';
    if (percentageDifference > 5) return 'default';
    if (percentageDifference < -5) return 'destructive';
    return 'secondary';
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Competitor Price Comparison</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-600">Carvana</p>
          <p className="text-lg font-semibold">{formatPrice(competitorPrices.carvana_value)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">CarMax</p>
          <p className="text-lg font-semibold">{formatPrice(competitorPrices.carmax_value)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Edmunds</p>
          <p className="text-lg font-semibold">{formatPrice(competitorPrices.edmunds_value)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Carfax</p>
          <p className="text-lg font-semibold">{formatPrice(competitorPrices.carfax_value)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Cars.com</p>
          <p className="text-lg font-semibold">{formatPrice(competitorPrices.carsdotcom_value)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Autotrader</p>
          <p className="text-lg font-semibold">{formatPrice(competitorPrices.autotrader_value)}</p>
        </div>
      </div>

      {averagePrice && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Market Average</p>
              <p className="text-xl font-bold">${averagePrice.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                {getTrendIcon()}
                <Badge variant={getTrendBadgeVariant()}>
                  {percentageDifference && percentageDifference > 0 ? '+' : ''}
                  {percentageDifference?.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                vs. Our Estimate
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        Last updated: {new Date(competitorPrices.fetched_at).toLocaleDateString()}
      </p>
    </Card>
  );
};

export default CompetitorPriceComparison;
