import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, AlertTriangle, CheckCircle, Settings, BarChart3 } from 'lucide-react';
// Price Adjustment Waterfall Component
const PriceAdjustmentWaterfall = ({ baseValue, adjusters, finalValue, animated = true }) => {
    const [animationProgress, setAnimationProgress] = useState(0);
    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setAnimationProgress(1), 200);
            return () => clearTimeout(timer);
        }
        else {
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
    const waterfallData = [
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
    const getBarHeight = (value) => {
        return Math.max((Math.abs(value) / valueRange) * maxHeight * animationProgress, 4);
    };
    const getYPosition = (cumulative, value) => {
        const baseY = maxHeight - ((cumulative - minValue) / valueRange) * maxHeight;
        return value < 0 ? baseY : baseY - getBarHeight(value);
    };
    return (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 overflow-x-auto", children: [_jsxs("h4", { className: "text-sm font-semibold text-gray-700 mb-4 flex items-center", children: [_jsx(BarChart3, { className: "w-4 h-4 mr-2" }), "Price Adjustment Waterfall"] }), _jsx("div", { className: "flex justify-center", children: _jsx("svg", { width: totalWidth, height: maxHeight + 60, className: "overflow-visible", children: waterfallData.map((item, index) => {
                        const x = index * spacing;
                        const barHeight = getBarHeight(item.value);
                        const y = getYPosition(item.cumulative, item.value);
                        let barColor = 'fill-gray-500';
                        if (item.type === 'positive')
                            barColor = 'fill-green-500';
                        else if (item.type === 'negative')
                            barColor = 'fill-red-500';
                        else if (item.type === 'final')
                            barColor = 'fill-blue-600';
                        return (_jsxs("g", { children: [index > 0 && (_jsx("line", { x1: x - spacing + barWidth, y1: getYPosition(waterfallData[index - 1].cumulative, 0), x2: x, y2: y + (item.value < 0 ? 0 : barHeight), stroke: "#d1d5db", strokeWidth: "1", strokeDasharray: "2,2", opacity: animationProgress })), _jsx("rect", { x: x, y: y, width: barWidth, height: barHeight, className: `${barColor} transition-all duration-700 ease-out`, rx: "2" }), _jsx("text", { x: x + barWidth / 2, y: y - 5, textAnchor: "middle", className: "fill-gray-700 text-xs font-medium", opacity: animationProgress, children: item.type === 'base' || item.type === 'final'
                                        ? `$${item.value.toLocaleString()}`
                                        : `${item.value >= 0 ? '+' : ''}$${item.value.toLocaleString()}` }), _jsx("text", { x: x + barWidth / 2, y: maxHeight + 20, textAnchor: "middle", className: "fill-gray-600 text-xs", opacity: animationProgress, children: item.label.length > 8 ? `${item.label.substring(0, 8)}...` : item.label })] }, index));
                    }) }) })] }));
};
// Adjuster Category Summary
const CategorySummary = ({ category, adjusters }) => {
    const categoryAdjusters = adjusters.filter(adj => adj.category === category && adj.isActive);
    if (categoryAdjusters.length === 0)
        return null;
    const totalImpact = categoryAdjusters.reduce((sum, adj) => sum + adj.impact, 0);
    const avgConfidence = categoryAdjusters.reduce((sum, adj) => sum + adj.confidence, 0) / categoryAdjusters.length;
    const getCategoryIcon = (cat) => {
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
    const getCategoryColor = (impact) => {
        if (impact > 0)
            return 'text-green-600 bg-green-50 border-green-200';
        if (impact < 0)
            return 'text-red-600 bg-red-50 border-red-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };
    return (_jsxs("div", { className: `rounded-lg border p-3 ${getCategoryColor(totalImpact)}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-lg", children: getCategoryIcon(category) }), _jsx("span", { className: "font-semibold text-sm capitalize", children: category })] }), _jsxs("span", { className: "text-xs bg-white px-2 py-1 rounded-full", children: [Math.round(avgConfidence * 100), "% conf."] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "font-bold text-lg", children: [totalImpact >= 0 ? '+' : '', "$", totalImpact.toLocaleString()] }), _jsxs("span", { className: "text-xs text-gray-600", children: [categoryAdjusters.length, " factor", categoryAdjusters.length !== 1 ? 's' : ''] })] })] }));
};
// Individual Adjuster Item
const AdjusterItem = ({ adjuster, showDetails = false }) => {
    const [expanded, setExpanded] = useState(false);
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    const getImpactIcon = () => {
        if (adjuster.impact > 0)
            return _jsx(TrendingUp, { className: "w-4 h-4 text-green-600" });
        if (adjuster.impact < 0)
            return _jsx(TrendingDown, { className: "w-4 h-4 text-red-600" });
        return _jsx(Minus, { className: "w-4 h-4 text-gray-600" });
    };
    return (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 bg-white", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [getImpactIcon(), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-gray-900", children: adjuster.name }), _jsxs("div", { className: "flex items-center space-x-2 mt-1", children: [_jsxs("span", { className: `px-2 py-1 text-xs rounded-full ${getSeverityColor(adjuster.severity)}`, children: [adjuster.severity, " impact"] }), _jsxs("span", { className: "text-xs text-gray-500", children: [Math.round(adjuster.confidence * 100), "% confidence"] })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-bold text-lg", children: [adjuster.impact >= 0 ? '+' : '', "$", adjuster.impact.toLocaleString()] }), _jsxs("div", { className: "text-sm text-gray-600", children: [adjuster.percentage >= 0 ? '+' : '', adjuster.percentage.toFixed(1), "%"] })] })] }), showDetails && (_jsxs("button", { onClick: () => setExpanded(!expanded), className: "mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center", children: [_jsx(Info, { className: "w-4 h-4 mr-1" }), expanded ? 'Hide Details' : 'Show Details'] })), expanded && (_jsxs("div", { className: "mt-3 pt-3 border-t border-gray-100", children: [_jsx("p", { className: "text-sm text-gray-700 mb-2", children: adjuster.reason }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsxs("span", { children: ["Source: ", adjuster.dataSource] }), _jsxs("span", { children: ["Category: ", adjuster.category] })] })] }))] }));
};
// Main Adjuster Breakdown Panel Component
const AdjusterBreakdownPanel = ({ data, isLoading = false, showDetails = true, compact = false }) => {
    const [viewMode, setViewMode] = useState('summary');
    if (isLoading) {
        return (_jsx("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-6 bg-gray-300 rounded w-1/2 mb-4" }), _jsx("div", { className: "h-32 bg-gray-300 rounded mb-4" }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-16 bg-gray-300 rounded" }), _jsx("div", { className: "h-16 bg-gray-300 rounded" })] })] }) }));
    }
    const activeAdjusters = data.adjusters.filter(adj => adj.isActive);
    const positiveAdjusters = activeAdjusters.filter(adj => adj.impact > 0);
    const negativeAdjusters = activeAdjusters.filter(adj => adj.impact < 0);
    const categories = [...new Set(activeAdjusters.map(adj => adj.category))];
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold mb-1", children: "Price Adjusters" }), _jsxs("p", { className: "text-purple-100 text-sm", children: [activeAdjusters.length, " active factors affecting valuation"] })] }), _jsx(Settings, { className: "w-8 h-8 text-purple-200" })] }), _jsxs("div", { className: "mt-4 grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: ["$", data.baseValue.toLocaleString()] }), _jsx("div", { className: "text-purple-200 text-sm", children: "Base Value" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: `text-2xl font-bold ${data.totalAdjustment >= 0 ? 'text-green-300' : 'text-red-300'}`, children: [data.totalAdjustment >= 0 ? '+' : '', "$", data.totalAdjustment.toLocaleString()] }), _jsx("div", { className: "text-purple-200 text-sm", children: "Total Adjustment" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: ["$", data.adjustedValue.toLocaleString()] }), _jsx("div", { className: "text-purple-200 text-sm", children: "Final Value" })] })] })] }), _jsx("div", { className: "border-b border-gray-200 p-4", children: _jsx("div", { className: "flex space-x-1 bg-gray-100 rounded-lg p-1", children: [
                        { key: 'summary', label: 'Summary' },
                        { key: 'waterfall', label: 'Waterfall' },
                        { key: 'detailed', label: 'Detailed' }
                    ].map((mode) => (_jsx("button", { onClick: () => setViewMode(mode.key), className: `flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${viewMode === mode.key
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'}`, children: mode.label }, mode.key))) }) }), _jsxs("div", { className: "p-6", children: [viewMode === 'summary' && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 gap-4", children: categories.map(category => (_jsx(CategorySummary, { category: category, adjusters: data.adjusters }, category))) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4", children: [_jsxs("h4", { className: "font-semibold text-green-800 mb-2 flex items-center", children: [_jsx(CheckCircle, { className: "w-4 h-4 mr-2" }), "Positive Factors"] }), _jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["+$", positiveAdjusters.reduce((sum, adj) => sum + adj.impact, 0).toLocaleString()] }), _jsxs("div", { className: "text-sm text-green-700", children: [positiveAdjusters.length, " factor", positiveAdjusters.length !== 1 ? 's' : ''] })] }), _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [_jsxs("h4", { className: "font-semibold text-red-800 mb-2 flex items-center", children: [_jsx(AlertTriangle, { className: "w-4 h-4 mr-2" }), "Negative Factors"] }), _jsxs("div", { className: "text-2xl font-bold text-red-600", children: ["$", negativeAdjusters.reduce((sum, adj) => sum + adj.impact, 0).toLocaleString()] }), _jsxs("div", { className: "text-sm text-red-700", children: [negativeAdjusters.length, " factor", negativeAdjusters.length !== 1 ? 's' : ''] })] })] })] })), viewMode === 'waterfall' && (_jsx(PriceAdjustmentWaterfall, { baseValue: data.baseValue, adjusters: activeAdjusters, finalValue: data.adjustedValue, animated: true })), viewMode === 'detailed' && (_jsx("div", { className: "space-y-4", children: activeAdjusters.map(adjuster => (_jsx(AdjusterItem, { adjuster: adjuster, showDetails: showDetails }, adjuster.id))) })), _jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Overall Confidence:" }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("div", { className: "w-16 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full transition-all duration-300", style: { width: `${data.confidenceScore * 100}%` } }) }), _jsxs("span", { className: "text-xs font-medium text-gray-700", children: [Math.round(data.confidenceScore * 100), "%"] })] })] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Updated ", new Date(data.lastUpdated).toLocaleTimeString()] })] })] })] }));
};
export default AdjusterBreakdownPanel;
