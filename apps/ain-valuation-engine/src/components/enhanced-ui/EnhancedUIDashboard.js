import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Maximize2, Minimize2, RefreshCw, Settings, Download, Share2, Filter } from 'lucide-react';
// Import panel components
import MarketIntelligencePanel from './panels/MarketIntelligencePanel';
import AdjusterBreakdownPanel from './panels/AdjusterBreakdownPanel';
import ConfidenceMetricsPanel from './panels/ConfidenceMetricsPanel';
// Panel size configurations
const getSizeClasses = (size, expanded) => {
    if (expanded)
        return 'col-span-2 row-span-2';
    switch (size) {
        case 'small': return 'col-span-1 row-span-1';
        case 'medium': return 'col-span-1 row-span-2';
        case 'large': return 'col-span-2 row-span-1';
        default: return 'col-span-1 row-span-1';
    }
};
// Loading Skeleton Component
const DashboardSkeleton = () => (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "h-8 bg-gray-300 rounded w-1/3 mb-2 animate-pulse" }), _jsx("div", { className: "h-4 bg-gray-300 rounded w-1/2 animate-pulse" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-6 auto-rows-fr", children: [_jsx("div", { className: "col-span-1 row-span-2 bg-gray-300 rounded-xl animate-pulse h-96" }), _jsx("div", { className: "col-span-1 row-span-1 bg-gray-300 rounded-xl animate-pulse h-44" }), _jsx("div", { className: "col-span-1 row-span-1 bg-gray-300 rounded-xl animate-pulse h-44" }), _jsx("div", { className: "col-span-2 row-span-1 bg-gray-300 rounded-xl animate-pulse h-44" })] })] }) }));
// Panel Container Component
const PanelContainer = ({ panel, children, onToggleExpand, onToggleVisibility, onRefresh }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const handleRefresh = async () => {
        if (onRefresh) {
            setIsRefreshing(true);
            await onRefresh();
            setTimeout(() => setIsRefreshing(false), 1000);
        }
    };
    return (_jsx("div", { className: `${getSizeClasses(panel.size, panel.expanded)} transition-all duration-300`, children: _jsxs("div", { className: "h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group", children: [_jsx("div", { className: "absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: _jsxs("div", { className: "flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm", children: [_jsx("button", { onClick: () => onToggleVisibility(panel.id), className: "p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors", title: panel.enabled ? 'Hide panel' : 'Show panel', children: panel.enabled ? _jsx(Eye, { className: "w-4 h-4" }) : _jsx(EyeOff, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => onToggleExpand(panel.id), className: "p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors", title: panel.expanded ? 'Minimize panel' : 'Expand panel', children: panel.expanded ? _jsx(Minimize2, { className: "w-4 h-4" }) : _jsx(Maximize2, { className: "w-4 h-4" }) }), onRefresh && (_jsx("button", { onClick: handleRefresh, disabled: isRefreshing, className: "p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50", title: "Refresh panel data", children: _jsx(RefreshCw, { className: `w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}` }) }))] }) }), _jsx("div", { className: `h-full ${!panel.enabled ? 'opacity-50 pointer-events-none' : ''}`, children: children })] }) }));
};
// Dashboard Controls Component
const DashboardControls = ({ onRefresh, onExport, onShare, onSettings, isRefreshing = false, lastUpdated }) => {
    const [showExportMenu, setShowExportMenu] = useState(false);
    return (_jsxs("div", { className: "flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Enhanced Valuation Dashboard" }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Last updated: ", new Date(lastUpdated).toLocaleString()] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { className: "px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2", children: [_jsx(Filter, { className: "w-4 h-4" }), _jsx("span", { children: "Filter" })] }), onRefresh && (_jsxs("button", { onClick: onRefresh, disabled: isRefreshing, className: "px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}` }), _jsx("span", { children: "Refresh" })] })), onExport && (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowExportMenu(!showExportMenu), className: "px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Export" })] }), showExportMenu && (_jsxs("div", { className: "absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10", children: [_jsx("button", { onClick: () => {
                                            onExport('pdf');
                                            setShowExportMenu(false);
                                        }, className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100", children: "Export PDF" }), _jsx("button", { onClick: () => {
                                            onExport('excel');
                                            setShowExportMenu(false);
                                        }, className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100", children: "Export Excel" })] }))] })), onShare && (_jsxs("button", { onClick: onShare, className: "px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2", children: [_jsx(Share2, { className: "w-4 h-4" }), _jsx("span", { children: "Share" })] })), onSettings && (_jsxs("button", { onClick: onSettings, className: "px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2", children: [_jsx(Settings, { className: "w-4 h-4" }), _jsx("span", { children: "Settings" })] }))] })] }));
};
// Main Enhanced UI Dashboard Component
const EnhancedUIDashboard = ({ data, onRefresh, onExport, onShare, onConfigChange, className = '' }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [panels, setPanels] = useState([
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
            }
            finally {
                setTimeout(() => setIsRefreshing(false), 1000);
            }
        }
    };
    // Toggle panel expansion
    const handleToggleExpand = (id) => {
        setPanels(prev => prev.map(panel => panel.id === id
            ? { ...panel, expanded: !panel.expanded }
            : { ...panel, expanded: false } // Only one panel can be expanded at a time
        ));
    };
    // Toggle panel visibility
    const handleToggleVisibility = (id) => {
        setPanels(prev => prev.map(panel => panel.id === id
            ? { ...panel, enabled: !panel.enabled }
            : panel));
    };
    // Show loading skeleton
    if (data.isLoading) {
        return _jsx(DashboardSkeleton, {});
    }
    return (_jsx("div", { className: `min-h-screen bg-gray-50 ${className}`, children: _jsxs("div", { className: "max-w-7xl mx-auto p-6", children: [_jsx(DashboardControls, { onRefresh: handleRefresh, onExport: onExport, onShare: onShare, isRefreshing: isRefreshing, lastUpdated: data.lastUpdated }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-900", children: [data.vehicle.year, " ", data.vehicle.make, " ", data.vehicle.model, data.vehicle.trim && ` ${data.vehicle.trim}`] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Enhanced valuation analysis" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: ["$", data.adjusterBreakdown.adjustedValue.toLocaleString()] }), _jsxs("div", { className: `text-sm ${data.adjusterBreakdown.totalAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`, children: [data.adjusterBreakdown.totalAdjustment >= 0 ? '+' : '', "$", data.adjusterBreakdown.totalAdjustment.toLocaleString(), " from base"] })] })] }) }), _jsx("div", { className: "grid grid-cols-3 gap-6 auto-rows-fr min-h-[600px] relative", children: panels.map(panel => {
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
                        return (_jsx(PanelContainer, { panel: panel, onToggleExpand: handleToggleExpand, onToggleVisibility: handleToggleVisibility, onRefresh: handleRefresh, children: _jsx(PanelComponent, { ...componentProps }) }, panel.id));
                    }) }), _jsxs("div", { className: "mt-8 text-center text-gray-500 text-sm", children: [_jsx("p", { children: "AIN Valuation Engine - Enhanced UI Dashboard" }), _jsx("p", { children: "Real-time market intelligence and sophisticated valuation analysis" })] })] }) }));
};
export default EnhancedUIDashboard;
