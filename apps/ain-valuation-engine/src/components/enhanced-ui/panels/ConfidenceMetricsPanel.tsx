import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, Database, Clock, AlertCircle, 
         CheckCircle, Users, MapPin, Calendar, Star } from 'lucide-react';

// Types for Confidence Metrics
interface DataSource {
  name: string;
  quality: number;       // 0-1
  recency: number;       // 0-1 (how recent the data is)
  coverage: number;      // 0-1 (how much data we have)
  reliability: number;   // 0-1 (historical accuracy)
  sampleSize: number;
  lastUpdated: string;
}

interface ConfidenceBreakdown {
  dataQuality: number;      // 0-1
  marketCoverage: number;   // 0-1
  algorithmicAccuracy: number; // 0-1
  temporalRelevance: number;   // 0-1
  geographicRelevance: number; // 0-1
  comparableVehicles: number;  // 0-1
}

interface ConfidenceMetricsData {
  overallConfidence: number;    // 0-1
  breakdown: ConfidenceBreakdown;
  dataSources: DataSource[];
  riskFactors: string[];
  strengthFactors: string[];
  recommendations: string[];
  historicalAccuracy: number;   // 0-1
  lastValidated: string;
}

interface ConfidenceMetricsPanelProps {
  data: ConfidenceMetricsData;
  isLoading?: boolean;
  compact?: boolean;
}

// Confidence Score Ring Component
const ConfidenceScoreRing: React.FC<{
  score: number;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showLabel?: boolean;
}> = ({ score, size = 'medium', animated = true, showLabel = true }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedScore(score), 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animated]);
  
  const dimensions = {
    small: { size: 60, stroke: 6, text: 'text-lg' },
    medium: { size: 80, stroke: 8, text: 'text-xl' },
    large: { size: 120, stroke: 10, text: 'text-3xl' }
  }[size];
  
  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(animatedScore) * circumference} ${circumference}`;
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'stroke-green-500 text-green-600';
    if (score >= 0.6) return 'stroke-yellow-500 text-yellow-600';
    if (score >= 0.4) return 'stroke-orange-500 text-orange-600';
    return 'stroke-red-500 text-red-600';
  };
  
  const getScoreGrade = (score: number) => {
    if (score >= 0.9) return 'A+';
    if (score >= 0.8) return 'A';
    if (score >= 0.7) return 'B+';
    if (score >= 0.6) return 'B';
    if (score >= 0.5) return 'C+';
    if (score >= 0.4) return 'C';
    if (score >= 0.3) return 'D';
    return 'F';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dimensions.size, height: dimensions.size }}>
        <svg
          className="transform -rotate-90"
          width={dimensions.size}
          height={dimensions.size}
        >
          {/* Background circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={dimensions.stroke}
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={dimensions.stroke}
            fill="none"
            className={`${getScoreColor(animatedScore).split(' ')[0]} transition-all duration-1000 ease-out`}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${dimensions.text} ${getScoreColor(animatedScore).split(' ')[1]}`}>
            {getScoreGrade(animatedScore)}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {Math.round(animatedScore * 100)}%
          </span>
        </div>
      </div>
      
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 mt-2">
          Confidence Score
        </span>
      )}
    </div>
  );
};

// Confidence Breakdown Radar Component
const ConfidenceRadar: React.FC<{
  breakdown: ConfidenceBreakdown;
  animated?: boolean;
}> = ({ breakdown, animated = true }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimationProgress(1), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);
  
  const metrics = [
    { key: 'dataQuality', label: 'Data Quality', value: breakdown.dataQuality },
    { key: 'marketCoverage', label: 'Market Coverage', value: breakdown.marketCoverage },
    { key: 'algorithmicAccuracy', label: 'Algorithm Accuracy', value: breakdown.algorithmicAccuracy },
    { key: 'temporalRelevance', label: 'Time Relevance', value: breakdown.temporalRelevance },
    { key: 'geographicRelevance', label: 'Geographic Relevance', value: breakdown.geographicRelevance },
    { key: 'comparableVehicles', label: 'Comparable Data', value: breakdown.comparableVehicles }
  ];
  
  const size = 200;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 70;
  
  // Calculate points for radar chart
  const points = metrics.map((metric, index) => {
    const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
    const value = metric.value * animationProgress;
    const x = centerX + Math.cos(angle) * radius * value;
    const y = centerY + Math.sin(angle) * radius * value;
    return { x, y, angle, metric };
  });
  
  // Create the polygon path
  const polygonPath = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
        Confidence Breakdown
      </h4>
      
      <div className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Grid circles */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map(level => (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={radius * level}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {metrics.map((_, index) => {
            const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Data polygon */}
          <path
            d={polygonPath}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              className="transition-all duration-1000 ease-out"
            />
          ))}
          
          {/* Labels */}
          {metrics.map((metric, index) => {
            const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
            const labelRadius = radius + 25;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-700 text-xs font-medium"
                transform={`rotate(${angle * 180 / Math.PI > 90 ? angle * 180 / Math.PI + 180 : angle * 180 / Math.PI}, ${x}, ${y})`}
              >
                {metric.label}
              </text>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-600">{metric.label}:</span>
            <span className="font-semibold text-gray-900">
              {Math.round(metric.value * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Data Source Quality Grid
const DataSourceGrid: React.FC<{
  sources: DataSource[];
  maxItems?: number;
}> = ({ sources, maxItems = 4 }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSources = showAll ? sources : sources.slice(0, maxItems);
  
  const getQualityColor = (quality: number) => {
    if (quality >= 0.8) return 'bg-green-100 border-green-300 text-green-800';
    if (quality >= 0.6) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    if (quality >= 0.4) return 'bg-orange-100 border-orange-300 text-orange-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };
  
  const getQualityIcon = (quality: number) => {
    if (quality >= 0.8) return <CheckCircle className="w-4 h-4" />;
    if (quality >= 0.6) return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };
  
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <Database className="w-4 h-4 mr-2" />
        Data Sources Quality
      </h4>
      
      <div className="grid grid-cols-2 gap-3">
        {displayedSources.map((source, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 ${getQualityColor(source.quality)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getQualityIcon(source.quality)}
                <span className="font-semibold text-sm">{source.name}</span>
              </div>
              <span className="text-xs font-bold">
                {Math.round(source.quality * 100)}%
              </span>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Recency:</span>
                <span>{Math.round(source.recency * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Coverage:</span>
                <span>{Math.round(source.coverage * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Sample Size:</span>
                <span>{source.sampleSize.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sources.length > maxItems && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAll ? 'Show Less' : `Show ${sources.length - maxItems} More`}
        </button>
      )}
    </div>
  );
};

// Risk and Strength Factors
const FactorsList: React.FC<{
  title: string;
  factors: string[];
  type: 'risk' | 'strength';
  icon: React.ReactNode;
  maxItems?: number;
}> = ({ title, factors, type, icon, maxItems = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedFactors = showAll ? factors : factors.slice(0, maxItems);
  
  const getTypeColor = (type: string) => {
    return type === 'risk' 
      ? 'border-red-200 bg-red-50' 
      : 'border-green-200 bg-green-50';
  };
  
  const getIconColor = (type: string) => {
    return type === 'risk' ? 'text-red-600' : 'text-green-600';
  };
  
  if (factors.length === 0) return null;
  
  return (
    <div className={`border rounded-lg p-4 ${getTypeColor(type)}`}>
      <h4 className={`text-sm font-semibold mb-3 flex items-center ${getIconColor(type)}`}>
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      
      <ul className="space-y-2">
        {displayedFactors.map((factor, index) => (
          <li key={index} className="flex items-start space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
              type === 'risk' ? 'bg-red-500' : 'bg-green-500'
            }`} />
            <span className="text-sm text-gray-700">{factor}</span>
          </li>
        ))}
      </ul>
      
      {factors.length > maxItems && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={`mt-3 text-sm font-medium ${
            type === 'risk' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
          }`}
        >
          {showAll ? 'Show Less' : `Show ${factors.length - maxItems} More`}
        </button>
      )}
    </div>
  );
};

// Main Confidence Metrics Panel Component
const ConfidenceMetricsPanel: React.FC<ConfidenceMetricsPanelProps> = ({
  data,
  isLoading = false,
  compact = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-32 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Confidence Analysis</h2>
            <p className="text-indigo-100 text-sm">
              Valuation reliability and data quality assessment
            </p>
          </div>
          <Shield className="w-8 h-8 text-indigo-200" />
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(data.overallConfidence * 100)}%
            </div>
            <div className="text-indigo-200 text-sm">Overall</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(data.historicalAccuracy * 100)}%
            </div>
            <div className="text-indigo-200 text-sm">Historical Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{data.dataSources.length}</div>
            <div className="text-indigo-200 text-sm">Data Sources</div>
          </div>
        </div>
      </div>
      
      {/* Panel Content */}
      <div className="p-6 space-y-6">
        {/* Confidence Score and Radar */}
        <div className={`grid ${compact ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`}>
          <div className="flex justify-center">
            <ConfidenceScoreRing
              score={data.overallConfidence}
              size="large"
              animated={true}
              showLabel={true}
            />
          </div>
          
          {!compact && (
            <ConfidenceRadar
              breakdown={data.breakdown}
              animated={true}
            />
          )}
        </div>
        
        {/* Data Sources Quality */}
        <DataSourceGrid sources={data.dataSources} />
        
        {/* Risk and Strength Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FactorsList
            title="Risk Factors"
            factors={data.riskFactors}
            type="risk"
            icon={<AlertCircle className="w-4 h-4" />}
          />
          
          <FactorsList
            title="Strength Factors"
            factors={data.strengthFactors}
            type="strength"
            icon={<CheckCircle className="w-4 h-4" />}
          />
        </div>
        
        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-blue-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>Community Validated</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>Regional Data</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Real-time Updates</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Last validated: {new Date(data.lastValidated).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceMetricsPanel;
export type { ConfidenceMetricsData, ConfidenceBreakdown, DataSource };
