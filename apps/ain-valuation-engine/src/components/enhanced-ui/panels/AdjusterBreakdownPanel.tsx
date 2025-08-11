import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, Info, 
         AlertTriangle, CheckCircle, Settings, BarChart3 } from 'lucide-react';

// Types for Adjuster data
interface AdjusterFactor {
  id: string;
  name: string;
  category: 'mileage' | 'condition' | 'options' | 'market' | 'safety' | 'performance';
  impact: number;          // Dollar amount (+/-)
  percentage: number;      // Percentage impact
  confidence: number;      // 0-1
  reason: string;
  isActive: boolean;
  severity: 'high' | 'medium' | 'low';
  dataSource: string;
}

interface WaterfallDataPoint {
  label: string;
  value: number;
  cumulative: number;
  type: string;
  adjuster?: AdjusterFactor;
}

interface AdjusterBreakdownData {
  baseValue: number;
  adjustedValue: number;
  totalAdjustment: number;
  adjustmentPercentage: number;
  adjusters: AdjusterFactor[];
  confidenceScore: number;
  lastUpdated: string;
}

interface AdjusterBreakdownPanelProps {
  data: AdjusterBreakdownData;
  isLoading?: boolean;
  showDetails?: boolean;
  compact?: boolean;
}

// Price Adjustment Waterfall Component
const PriceAdjustmentWaterfall: React.FC<{
  baseValue: number;
  adjusters: AdjusterFactor[];
  finalValue: number;
  animated?: boolean;
}> = ({ baseValue, adjusters, finalValue, animated = true }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimationProgress(1), 200);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);
  
  // Sort adjusters by impact for waterfall visualization
  const sortedAdjusters = [...adjusters]
    .filter(adj => adj.isActive)
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  
  const maxHeight = 200;
  const barWidth = 60;
  const spacing = 80;
  const totalWidth = (sortedAdjusters.length + 2) * spacing;
  
  // Calculate cumulative values for waterfall
  let cumulativeValue = baseValue;
  const waterfallData: WaterfallDataPoint[] = [
    { label: 'Base Value', value: baseValue, cumulative: baseValue, type: 'base' }
  ];
  
  sortedAdjusters.forEach((adjuster, index) => {
    const prevCumulative = cumulativeValue;
    cumulativeValue += adjuster.impact;
    waterfallData.push({
      label: adjuster.name,
      value: adjuster.impact,
      cumulative: cumulativeValue,
      type: adjuster.impact >= 0 ? 'positive' : 'negative',
      adjuster
    });
  });
  
  waterfallData.push({
    label: 'Final Value',
    value: finalValue,
    cumulative: finalValue,
    type: 'final'
  });
  
  const minValue = Math.min(baseValue, finalValue, ...sortedAdjusters.map(a => a.impact));
  const maxValue = Math.max(baseValue, finalValue, ...sortedAdjusters.map(a => a.impact));
  const valueRange = Math.max(maxValue - minValue, 1000); // Minimum range for visibility
  
  const getBarHeight = (value: number) => {
    return Math.max((Math.abs(value) / valueRange) * maxHeight * animationProgress, 4);
  };
  
  const getYPosition = (cumulative: number, value: number) => {
    const baseY = maxHeight - ((cumulative - minValue) / valueRange) * maxHeight;
    return value < 0 ? baseY : baseY - getBarHeight(value);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
        <BarChart3 className="w-4 h-4 mr-2" />
        Price Adjustment Waterfall
      </h4>
      
      <div className="flex justify-center">
        <svg width={totalWidth} height={maxHeight + 60} className="overflow-visible">
          {waterfallData.map((item, index) => {
            const x = index * spacing;
            const barHeight = getBarHeight(item.value);
            const y = getYPosition(item.cumulative, item.value);
            
            let barColor = 'fill-gray-500';
            if (item.type === 'positive') barColor = 'fill-green-500';
            else if (item.type === 'negative') barColor = 'fill-red-500';
            else if (item.type === 'final') barColor = 'fill-blue-600';
            
            return (
              <g key={index}>
                {/* Connector line to previous bar */}
                {index > 0 && (
                  <line
                    x1={x - spacing + barWidth}
                    y1={getYPosition(waterfallData[index - 1].cumulative, 0)}
                    x2={x}
                    y2={y + (item.value < 0 ? 0 : barHeight)}
                    stroke="#d1d5db"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    opacity={animationProgress}
                  />
                )}
                
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  className={`${barColor} transition-all duration-700 ease-out`}
                  rx="2"
                />
                
                {/* Value label on bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-gray-700 text-xs font-medium"
                  opacity={animationProgress}
                >
                  {item.type === 'base' || item.type === 'final' 
                    ? `$${item.value.toLocaleString()}`
                    : `${item.value >= 0 ? '+' : ''}$${item.value.toLocaleString()}`
                  }
                </text>
                
                {/* Label below bar */}
                <text
                  x={x + barWidth / 2}
                  y={maxHeight + 20}
                  textAnchor="middle"
                  className="fill-gray-600 text-xs"
                  opacity={animationProgress}
                >
                  {item.label.length > 8 ? `${item.label.substring(0, 8)}...` : item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// Adjuster Category Summary
const CategorySummary: React.FC<{
  category: string;
  adjusters: AdjusterFactor[];
}> = ({ category, adjusters }) => {
  const categoryAdjusters = adjusters.filter(adj => adj.category === category && adj.isActive);
  
  if (categoryAdjusters.length === 0) return null;
  
  const totalImpact = categoryAdjusters.reduce((sum, adj) => sum + adj.impact, 0);
  const avgConfidence = categoryAdjusters.reduce((sum, adj) => sum + adj.confidence, 0) / categoryAdjusters.length;
  
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'mileage': return '🛣️';
      case 'condition': return '🔧';
      case 'options': return '⚙️';
      case 'market': return '📈';
      case 'safety': return '🛡️';
      case 'performance': return '🏁';
      default: return '📊';
    }
  };
  
  const getCategoryColor = (impact: number) => {
    if (impact > 0) return 'text-green-600 bg-green-50 border-green-200';
    if (impact < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };
  
  return (
    <div className={`rounded-lg border p-3 ${getCategoryColor(totalImpact)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getCategoryIcon(category)}</span>
          <span className="font-semibold text-sm capitalize">{category}</span>
        </div>
        <span className="text-xs bg-white px-2 py-1 rounded-full">
          {Math.round(avgConfidence * 100)}% conf.
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">
          {totalImpact >= 0 ? '+' : ''}${totalImpact.toLocaleString()}
        </span>
        <span className="text-xs text-gray-600">
          {categoryAdjusters.length} factor{categoryAdjusters.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

// Individual Adjuster Item
const AdjusterItem: React.FC<{
  adjuster: AdjusterFactor;
  showDetails?: boolean;
}> = ({ adjuster, showDetails = false }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getImpactIcon = () => {
    if (adjuster.impact > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (adjuster.impact < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getImpactIcon()}
          <div>
            <h5 className="font-semibold text-gray-900">{adjuster.name}</h5>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(adjuster.severity)}`}>
                {adjuster.severity} impact
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(adjuster.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-bold text-lg">
            {adjuster.impact >= 0 ? '+' : ''}${adjuster.impact.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            {adjuster.percentage >= 0 ? '+' : ''}{adjuster.percentage.toFixed(1)}%
          </div>
        </div>
      </div>
      
      {showDetails && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          <Info className="w-4 h-4 mr-1" />
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      )}
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-700 mb-2">{adjuster.reason}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Source: {adjuster.dataSource}</span>
            <span>Category: {adjuster.category}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Adjuster Breakdown Panel Component
const AdjusterBreakdownPanel: React.FC<AdjusterBreakdownPanelProps> = ({
  data,
  isLoading = false,
  showDetails = true,
  compact = false
}) => {
  const [viewMode, setViewMode] = useState<'summary' | 'detailed' | 'waterfall'>('summary');
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const activeAdjusters = data.adjusters.filter(adj => adj.isActive);
  const positiveAdjusters = activeAdjusters.filter(adj => adj.impact > 0);
  const negativeAdjusters = activeAdjusters.filter(adj => adj.impact < 0);
  
  const categories = [...new Set(activeAdjusters.map(adj => adj.category))];
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Price Adjusters</h2>
            <p className="text-purple-100 text-sm">
              {activeAdjusters.length} active factors affecting valuation
            </p>
          </div>
          <Settings className="w-8 h-8 text-purple-200" />
        </div>
        
        {/* Quick Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">${data.baseValue.toLocaleString()}</div>
            <div className="text-purple-200 text-sm">Base Value</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              data.totalAdjustment >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {data.totalAdjustment >= 0 ? '+' : ''}${data.totalAdjustment.toLocaleString()}
            </div>
            <div className="text-purple-200 text-sm">Total Adjustment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${data.adjustedValue.toLocaleString()}</div>
            <div className="text-purple-200 text-sm">Final Value</div>
          </div>
        </div>
      </div>
      
      {/* View Mode Selector */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'summary', label: 'Summary' },
            { key: 'waterfall', label: 'Waterfall' },
            { key: 'detailed', label: 'Detailed' }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === mode.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Panel Content */}
      <div className="p-6">
        {viewMode === 'summary' && (
          <div className="space-y-6">
            {/* Category Summaries */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map(category => (
                <CategorySummary
                  key={category}
                  category={category}
                  adjusters={data.adjusters}
                />
              ))}
            </div>
            
            {/* Impact Distribution */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Positive Factors
                </h4>
                <div className="text-2xl font-bold text-green-600">
                  +${positiveAdjusters.reduce((sum, adj) => sum + adj.impact, 0).toLocaleString()}
                </div>
                <div className="text-sm text-green-700">
                  {positiveAdjusters.length} factor{positiveAdjusters.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Negative Factors
                </h4>
                <div className="text-2xl font-bold text-red-600">
                  ${negativeAdjusters.reduce((sum, adj) => sum + adj.impact, 0).toLocaleString()}
                </div>
                <div className="text-sm text-red-700">
                  {negativeAdjusters.length} factor{negativeAdjusters.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'waterfall' && (
          <PriceAdjustmentWaterfall
            baseValue={data.baseValue}
            adjusters={activeAdjusters}
            finalValue={data.adjustedValue}
            animated={true}
          />
        )}
        
        {viewMode === 'detailed' && (
          <div className="space-y-4">
            {activeAdjusters.map(adjuster => (
              <AdjusterItem
                key={adjuster.id}
                adjuster={adjuster}
                showDetails={showDetails}
              />
            ))}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Overall Confidence:</span>
            <div className="flex items-center space-x-1">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.confidenceScore * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {Math.round(data.confidenceScore * 100)}%
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Updated {new Date(data.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjusterBreakdownPanel;
export type { AdjusterFactor, AdjusterBreakdownData };
