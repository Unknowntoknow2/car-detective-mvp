import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Maximize2, Minimize2, RefreshCw, 
         Settings, Download, Share2, Filter } from 'lucide-react';

// Import panel components
import MarketIntelligencePanel from './panels/MarketIntelligencePanel';
import AdjusterBreakdownPanel from './panels/AdjusterBreakdownPanel';
import ConfidenceMetricsPanel from './panels/ConfidenceMetricsPanel';

// Types for the dashboard
interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
}

interface MarketIntelligenceData {
  marketScore: number;
  marketTemperature: string;
  salesMomentum: string;
  consumerInterest: string;
  regionalFactors: string[];
  dataQuality: number;
  lastUpdated: string;
}

interface AdjusterBreakdownData {
  baseValue: number;
  adjustedValue: number;
  totalAdjustment: number;
  adjustmentPercentage: number;
  adjusters: any[];
  confidenceScore: number;
  lastUpdated: string;
}

interface ConfidenceMetricsData {
  overallConfidence: number;
  breakdown: {
    dataQuality: number;
    marketCoverage: number;
    algorithmicAccuracy: number;
  };
  dataSources: any[];
  lastValidated: string;
}

interface EnhancedUIDashboardData {
  marketIntelligence: MarketIntelligenceData;
  adjusterBreakdown: AdjusterBreakdownData;
  confidenceMetrics: ConfidenceMetricsData;
  vehicle: VehicleInfo;
  isLoading?: boolean;
  lastUpdated: string;
}

interface PanelConfig {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  enabled: boolean;
  expanded: boolean;
  position: { row: number; col: number };
  size: 'small' | 'medium' | 'large';
}

interface EnhancedUIDashboardProps {
  data: EnhancedUIDashboardData;
  onRefresh?: () => void;
  onExport?: (format: 'pdf' | 'excel') => void;
  onShare?: () => void;
  onConfigChange?: (config: PanelConfig[]) => void;
  className?: string;
}

// Panel size configurations
const getSizeClasses = (size: string, expanded: boolean) => {
  if (expanded) return 'col-span-2 row-span-2';
  
  switch (size) {
    case 'small': return 'col-span-1 row-span-1';
    case 'medium': return 'col-span-1 row-span-2';
    case 'large': return 'col-span-2 row-span-1';
    default: return 'col-span-1 row-span-1';
  }
};

// Loading Skeleton Component
const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-3 gap-6 auto-rows-fr">
        <div className="col-span-1 row-span-2 bg-gray-300 rounded-xl animate-pulse h-96"></div>
        <div className="col-span-1 row-span-1 bg-gray-300 rounded-xl animate-pulse h-44"></div>
        <div className="col-span-1 row-span-1 bg-gray-300 rounded-xl animate-pulse h-44"></div>
        <div className="col-span-2 row-span-1 bg-gray-300 rounded-xl animate-pulse h-44"></div>
      </div>
    </div>
  </div>
);

// Panel Container Component
const PanelContainer: React.FC<{
  panel: PanelConfig;
  children: React.ReactNode;
  onToggleExpand: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRefresh?: () => void;
}> = ({ panel, children, onToggleExpand, onToggleVisibility, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };
  
  return (
    <div className={`${getSizeClasses(panel.size, panel.expanded)} transition-all duration-300`}>
      <div className="h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group">
        {/* Panel Header */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
            <button
              onClick={() => onToggleVisibility(panel.id)}
              className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
              title={panel.enabled ? 'Hide panel' : 'Show panel'}
            >
              {panel.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => onToggleExpand(panel.id)}
              className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
              title={panel.expanded ? 'Minimize panel' : 'Expand panel'}
            >
              {panel.expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                title="Refresh panel data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>
        
        {/* Panel Content */}
        <div className={`h-full ${!panel.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Dashboard Controls Component
const DashboardControls: React.FC<{
  onRefresh?: () => void;
  onExport?: (format: 'pdf' | 'excel') => void;
  onShare?: () => void;
  onSettings?: () => void;
  isRefreshing?: boolean;
  lastUpdated: string;
}> = ({ onRefresh, onExport, onShare, onSettings, isRefreshing = false, lastUpdated }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 mb-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Valuation Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Filter Button */}
        <button className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
        
        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
        
        {/* Export Menu */}
        {onExport && (
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onExport('pdf');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => {
                    onExport('excel');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export Excel
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Share Button */}
        {onShare && (
          <button
            onClick={onShare}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        )}
        
        {/* Settings Button */}
        {onSettings && (
          <button
            onClick={onSettings}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Main Enhanced UI Dashboard Component
const EnhancedUIDashboard: React.FC<EnhancedUIDashboardProps> = ({
  data,
  onRefresh,
  onExport,
  onShare,
  onConfigChange,
  className = ''
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [panels, setPanels] = useState<PanelConfig[]>([
    {
      id: 'market-intelligence',
      name: 'Market Intelligence',
      component: MarketIntelligencePanel,
      enabled: true,
      expanded: false,
      position: { row: 0, col: 0 },
      size: 'medium'
    },
    {
      id: 'adjuster-breakdown',
      name: 'Adjuster Breakdown',
      component: AdjusterBreakdownPanel,
      enabled: true,
      expanded: false,
      position: { row: 0, col: 1 },
      size: 'large'
    },
    {
      id: 'confidence-metrics',
      name: 'Confidence Metrics',
      component: ConfidenceMetricsPanel,
      enabled: true,
      expanded: false,
      position: { row: 1, col: 0 },
      size: 'medium'
    }
  ]);
  
  // Handle panel configuration changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(panels);
    }
  }, [panels, onConfigChange]);
  
  // Handle refresh with loading state
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 1000);
      }
    }
  };
  
  // Toggle panel expansion
  const handleToggleExpand = (id: string) => {
    setPanels(prev => prev.map(panel => 
      panel.id === id 
        ? { ...panel, expanded: !panel.expanded }
        : { ...panel, expanded: false } // Only one panel can be expanded at a time
    ));
  };
  
  // Toggle panel visibility
  const handleToggleVisibility = (id: string) => {
    setPanels(prev => prev.map(panel => 
      panel.id === id 
        ? { ...panel, enabled: !panel.enabled }
        : panel
    ));
  };
  
  // Show loading skeleton
  if (data.isLoading) {
    return <DashboardSkeleton />;
  }
  
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Controls */}
        <DashboardControls
          onRefresh={handleRefresh}
          onExport={onExport}
          onShare={onShare}
          isRefreshing={isRefreshing}
          lastUpdated={data.lastUpdated}
        />
        
        {/* Vehicle Information Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {data.vehicle.year} {data.vehicle.make} {data.vehicle.model}
                {data.vehicle.trim && ` ${data.vehicle.trim}`}
              </h2>
              <p className="text-gray-600 mt-1">Enhanced valuation analysis</p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${data.adjusterBreakdown.adjustedValue.toLocaleString()}
              </div>
              <div className={`text-sm ${
                data.adjusterBreakdown.totalAdjustment >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.adjusterBreakdown.totalAdjustment >= 0 ? '+' : ''}
                ${data.adjusterBreakdown.totalAdjustment.toLocaleString()} from base
              </div>
            </div>
          </div>
        </div>
        
        {/* Panels Grid */}
        <div className="grid grid-cols-3 gap-6 auto-rows-fr min-h-[600px] relative">
          {panels.map(panel => {
            const PanelComponent = panel.component;
            let panelData;
            let componentProps = {};
            
            // Map data to appropriate panel
            switch (panel.id) {
              case 'market-intelligence':
                panelData = data.marketIntelligence;
                componentProps = { 
                  data: panelData, 
                  vehicle: data.vehicle,
                  compact: panel.size === 'small'
                };
                break;
              case 'adjuster-breakdown':
                panelData = data.adjusterBreakdown;
                componentProps = { 
                  data: panelData,
                  compact: panel.size === 'small'
                };
                break;
              case 'confidence-metrics':
                panelData = data.confidenceMetrics;
                componentProps = { 
                  data: panelData,
                  compact: panel.size === 'small'
                };
                break;
              default:
                return null;
            }
            
            return (
              <PanelContainer
                key={panel.id}
                panel={panel}
                onToggleExpand={handleToggleExpand}
                onToggleVisibility={handleToggleVisibility}
                onRefresh={handleRefresh}
              >
                <PanelComponent {...componentProps} />
              </PanelContainer>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>AIN Valuation Engine - Enhanced UI Dashboard</p>
          <p>Real-time market intelligence and sophisticated valuation analysis</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUIDashboard;
export type { EnhancedUIDashboardData, PanelConfig };
