import React, { useState, useEffect } from 'react';
import { TrendingUp, Thermometer, Activity, Eye, DollarSign, Clock } from 'lucide-react';

// Types for Market Intelligence data
interface MarketIntelligenceData {
  marketScore: number;          // 0-100
  marketTemperature: 'hot' | 'warm' | 'cool' | 'cold';
  salesMomentum: string;        // 'strong' | 'moderate' | 'weak'
  consumerInterest: string;     // 'high' | 'moderate' | 'low'
  priceStability: string;       // 'stable' | 'volatile' | 'declining'
  marketLiquidity: string;      // 'high' | 'moderate' | 'low'
  regionalFactors: string[];
  dataQuality: number;          // 0-1
  lastUpdated: string;
}

interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
}

interface MarketIntelligencePanelProps {
  data: MarketIntelligenceData;
  vehicle: VehicleInfo;
  isLoading?: boolean;
  compact?: boolean;
}

// Market Temperature Gauge Component
const MarketTemperatureGauge: React.FC<{
  temperature: string;
  score: number;
  animated?: boolean;
}> = ({ temperature, score, animated = true }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedScore(score), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animated]);
  
  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot': return 'text-red-600 bg-red-100';
      case 'warm': return 'text-orange-600 bg-orange-100';
      case 'cool': return 'text-blue-600 bg-blue-100';
      case 'cold': return 'text-blue-800 bg-blue-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getGaugeColor = (temp: string) => {
    switch (temp) {
      case 'hot': return 'stroke-red-500';
      case 'warm': return 'stroke-orange-500';
      case 'cool': return 'stroke-blue-500';
      case 'cold': return 'stroke-blue-700';
      default: return 'stroke-gray-500';
    }
  };
  
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(animatedScore / 100) * circumference} ${circumference}`;
  
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className={`${getGaugeColor(temperature)} transition-all duration-1000 ease-out`}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{animatedScore}</span>
          <span className="text-xs text-gray-500">score</span>
        </div>
      </div>
      
      <div className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getTemperatureColor(temperature)}`}>
        <Thermometer className="inline w-4 h-4 mr-1" />
        {temperature} Market
      </div>
    </div>
  );
};

// Metric Display Component
const MetricDisplay: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
  confidence?: number;
  className?: string;
}> = ({ icon, label, value, trend, confidence, className = '' }) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    return (
      <span className={`ml-2 text-xs ${
        trend === 'up' ? 'text-green-600' : 
        trend === 'down' ? 'text-red-600' : 
        'text-gray-600'
      }`}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
      </span>
    );
  };
  
  return (
    <div className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-gray-600">
          {icon}
          <span className="ml-2 text-sm font-medium">{label}</span>
        </div>
        {confidence && (
          <span className="text-xs text-gray-500">
            {Math.round(confidence * 100)}% confidence
          </span>
        )}
      </div>
      <div className="flex items-center">
        <span className="text-lg font-semibold text-gray-900 capitalize">
          {value}
        </span>
        {getTrendIcon()}
      </div>
    </div>
  );
};

// Regional Insights List Component
const RegionalInsightsList: React.FC<{
  insights: string[];
  maxItems?: number;
}> = ({ insights, maxItems = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedInsights = showAll ? insights : insights.slice(0, maxItems);
  
  if (insights.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No regional insights available
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Regional Factors</h4>
      <ul className="space-y-2">
        {displayedInsights.map((insight, index) => (
          <li key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <span className="text-sm text-gray-700">{insight}</span>
          </li>
        ))}
      </ul>
      
      {insights.length > maxItems && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAll ? 'Show Less' : `Show ${insights.length - maxItems} More`}
        </button>
      )}
    </div>
  );
};

// Live Data Indicator Component
const LiveDataIndicator: React.FC<{
  lastUpdated: string;
  isConnected?: boolean;
}> = ({ lastUpdated, isConnected = true }) => {
  const [timeAgo, setTimeAgo] = useState('');
  
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const updated = new Date(lastUpdated);
      const diffInMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) {
        setTimeAgo('just now');
      } else if (diffInMinutes < 60) {
        setTimeAgo(`${diffInMinutes}m ago`);
      } else {
        const hours = Math.floor(diffInMinutes / 60);
        setTimeAgo(`${hours}h ago`);
      }
    };
    
    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [lastUpdated]);
  
  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500">
      <div className={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
      }`} />
      <Clock className="w-3 h-3" />
      <span>Updated {timeAgo}</span>
    </div>
  );
};

// Main Market Intelligence Panel Component
const MarketIntelligencePanel: React.FC<MarketIntelligencePanelProps> = ({
  data,
  vehicle,
  isLoading = false,
  compact = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Market Intelligence</h2>
            <p className="text-blue-100 text-sm">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim && ` ${vehicle.trim}`}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-200" />
        </div>
      </div>
      
      {/* Panel Content */}
      <div className="p-6">
        {/* Market Temperature Gauge */}
        <div className="flex justify-center mb-8">
          <MarketTemperatureGauge
            temperature={data.marketTemperature}
            score={data.marketScore}
            animated={true}
          />
        </div>
        
        {/* Market Metrics Grid */}
        <div className={`grid ${compact ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'} mb-6`}>
          <MetricDisplay
            icon={<Activity className="w-4 h-4" />}
            label="Sales Momentum"
            value={data.salesMomentum}
            trend={data.salesMomentum === 'strong' ? 'up' : 
                   data.salesMomentum === 'weak' ? 'down' : 'stable'}
            confidence={data.dataQuality}
          />
          
          <MetricDisplay
            icon={<Eye className="w-4 h-4" />}
            label="Consumer Interest"
            value={data.consumerInterest}
            confidence={data.dataQuality}
          />
          
          {!compact && (
            <>
              <MetricDisplay
                icon={<DollarSign className="w-4 h-4" />}
                label="Price Stability"
                value={data.priceStability}
                trend={data.priceStability === 'stable' ? 'stable' : 
                       data.priceStability === 'volatile' ? 'down' : 'down'}
                confidence={data.dataQuality}
              />
              
              <MetricDisplay
                icon={<TrendingUp className="w-4 h-4" />}
                label="Market Liquidity"
                value={data.marketLiquidity}
                confidence={data.dataQuality}
              />
            </>
          )}
        </div>
        
        {/* Regional Insights */}
        {data.regionalFactors.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <RegionalInsightsList 
              insights={data.regionalFactors}
              maxItems={compact ? 2 : 3}
            />
          </div>
        )}
        
        {/* Footer with data quality and last updated */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Data Quality:</span>
            <div className="flex items-center space-x-1">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.dataQuality * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {Math.round(data.dataQuality * 100)}%
              </span>
            </div>
          </div>
          
          <LiveDataIndicator lastUpdated={data.lastUpdated} />
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligencePanel;
export type { MarketIntelligenceData, VehicleInfo };
