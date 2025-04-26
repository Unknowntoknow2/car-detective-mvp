
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label, Cell, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface PriceDistributionChartProps {
  distribution: number[];
  listingCount: number;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    trim?: string;
  };
  priceRange: {
    lowest: number;
    average: number;
    highest: number;
  };
}

export function PriceDistributionChart({ 
  distribution, 
  listingCount,
  vehicleInfo,
  priceRange
}: PriceDistributionChartProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [highlightedBar, setHighlightedBar] = useState<number | null>(null);
  
  // Calculate price ranges for the chart
  const priceStep = Math.round((priceRange.highest - priceRange.lowest) / (distribution.length - 1));
  
  // Create chart data
  const chartData = distribution.map((count, index) => {
    const minPrice = priceRange.lowest + (index * priceStep);
    const maxPrice = minPrice + priceStep;
    const label = `$${(minPrice / 1000).toFixed(0)}K - $${(maxPrice / 1000).toFixed(0)}K`;
    
    return {
      range: label,
      count,
      minPrice,
      maxPrice,
      isYourRange: priceRange.average >= minPrice && priceRange.average <= maxPrice
    };
  });

  // Find most common price range
  const mostCommonRange = [...chartData].sort((a, b) => b.count - a.count)[0];
  
  // Calculate where your price falls as a percentile
  const totalListings = chartData.reduce((sum, item) => sum + item.count, 0);
  let valuePercentile = 0;
  
  // Find which range contains your value
  const yourValueIndex = chartData.findIndex(item => item.isYourRange);
  if (yourValueIndex !== -1) {
    // Count listings below your value
    const listingsBelowValue = chartData
      .slice(0, yourValueIndex)
      .reduce((sum, item) => sum + item.count, 0);
    
    // Calculate percentile (listings below your value / total listings)
    valuePercentile = Math.round((listingsBelowValue / totalListings) * 100);
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Market Price Distribution</h3>
          <div className="text-sm text-slate-500">
            Based on {listingCount} similar {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} {vehicleInfo.trim || ''} listings
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
              onMouseMove={(data) => {
                if (data && data.activeTooltipIndex !== undefined) {
                  setHighlightedBar(data.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHighlightedBar(null)}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#94a3b8"
              />
              <YAxis 
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#94a3b8"
                label={{ 
                  value: 'Number of Listings', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12, fill: '#64748b' }
                }}
              />
              <Tooltip 
                formatter={(value: number) => [value, 'Listings']}
                labelFormatter={(range) => `Price Range: ${range}`}
                contentStyle={{ 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0'
                }}
              />
              
              {/* Vertical line for the average price */}
              <ReferenceLine 
                x={chartData.find(d => d.isYourRange)?.range} 
                stroke="#7c3aed" 
                strokeWidth={2}
                strokeDasharray="3 3"
              >
                <Label 
                  value="Your Est. Value" 
                  position="top" 
                  fill="#7c3aed"
                  fontSize={12}
                />
              </ReferenceLine>
              
              {/* Use Bar with Cell children instead of dynamic fill function */}
              <Bar 
                dataKey="count" 
                fill="#c4b5fd"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isYourRange ? '#7c3aed' : (highlightedBar === index ? '#a78bfa' : '#c4b5fd')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-3 text-center border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm text-slate-500">Lowest Price</p>
            <p className="font-semibold">${priceRange.lowest.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Average Price</p>
            <p className="font-semibold">${priceRange.average.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Highest Price</p>
            <p className="font-semibold">${priceRange.highest.toLocaleString()}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full mt-4 flex items-center justify-center text-sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Hide Market Insights
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Market Insights
            </>
          )}
        </Button>
        
        {showDetails && (
          <div className="mt-4 space-y-4 p-4 bg-purple-50 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Market Position</h4>
                <p className="text-slate-600">
                  Your vehicle's estimated value is higher than approximately {valuePercentile}% of 
                  similar listings in the market.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Price Distribution</h4>
                <p className="text-slate-600">
                  The most common price range is {mostCommonRange.range}, with {mostCommonRange.count} vehicles 
                  listed in this bracket.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Pricing Strategy</h4>
                <p className="text-slate-600">
                  {priceRange.average > mostCommonRange.maxPrice
                    ? "Your vehicle is priced above the most common range. Consider highlighting unique features to justify the premium."
                    : priceRange.average < mostCommonRange.minPrice
                    ? "Your vehicle is priced below the most common range, which may attract more buyers but could undervalue your vehicle."
                    : "Your vehicle is priced within the most common market range, which is typically optimal for balancing time-to-sell and value."}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
