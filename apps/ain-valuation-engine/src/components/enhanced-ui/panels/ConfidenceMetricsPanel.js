import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Shield, Database, Clock, AlertCircle, CheckCircle, Users, MapPin, Calendar, Star } from 'lucide-react';
// Confidence Score Ring Component
const ConfidenceScoreRing = ({ score, size = 'medium', animated = true, showLabel = true }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setAnimatedScore(score), 200);
            return () => clearTimeout(timer);
        }
        else {
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
    const getScoreColor = (score) => {
        if (score >= 0.8)
            return 'stroke-green-500 text-green-600';
        if (score >= 0.6)
            return 'stroke-yellow-500 text-yellow-600';
        if (score >= 0.4)
            return 'stroke-orange-500 text-orange-600';
        return 'stroke-red-500 text-red-600';
    };
    const getScoreGrade = (score) => {
        if (score >= 0.9)
            return 'A+';
        if (score >= 0.8)
            return 'A';
        if (score >= 0.7)
            return 'B+';
        if (score >= 0.6)
            return 'B';
        if (score >= 0.5)
            return 'C+';
        if (score >= 0.4)
            return 'C';
        if (score >= 0.3)
            return 'D';
        return 'F';
    };
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative", style: { width: dimensions.size, height: dimensions.size }, children: [_jsxs("svg", { className: "transform -rotate-90", width: dimensions.size, height: dimensions.size, children: [_jsx("circle", { cx: dimensions.size / 2, cy: dimensions.size / 2, r: radius, stroke: "currentColor", strokeWidth: dimensions.stroke, fill: "none", className: "text-gray-200" }), _jsx("circle", { cx: dimensions.size / 2, cy: dimensions.size / 2, r: radius, stroke: "currentColor", strokeWidth: dimensions.stroke, fill: "none", className: `${getScoreColor(animatedScore).split(' ')[0]} transition-all duration-1000 ease-out`, strokeDasharray: strokeDasharray, strokeLinecap: "round" })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx("span", { className: `font-bold ${dimensions.text} ${getScoreColor(animatedScore).split(' ')[1]}`, children: getScoreGrade(animatedScore) }), _jsxs("span", { className: "text-xs text-gray-500 mt-1", children: [Math.round(animatedScore * 100), "%"] })] })] }), showLabel && (_jsx("span", { className: "text-sm font-medium text-gray-700 mt-2", children: "Confidence Score" }))] }));
};
// Confidence Breakdown Radar Component
const ConfidenceRadar = ({ breakdown, animated = true }) => {
    const [animationProgress, setAnimationProgress] = useState(0);
    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setAnimationProgress(1), 300);
            return () => clearTimeout(timer);
        }
        else {
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
    const polygonPath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ') + ' Z';
    return (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-4 text-center", children: "Confidence Breakdown" }), _jsx("div", { className: "flex justify-center", children: _jsxs("svg", { width: size, height: size, className: "overflow-visible", children: [[0.2, 0.4, 0.6, 0.8, 1.0].map(level => (_jsx("circle", { cx: centerX, cy: centerY, r: radius * level, fill: "none", stroke: "#e5e7eb", strokeWidth: "1" }, level))), metrics.map((_, index) => {
                            const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
                            const x = centerX + Math.cos(angle) * radius;
                            const y = centerY + Math.sin(angle) * radius;
                            return (_jsx("line", { x1: centerX, y1: centerY, x2: x, y2: y, stroke: "#e5e7eb", strokeWidth: "1" }, index));
                        }), _jsx("path", { d: polygonPath, fill: "rgba(59, 130, 246, 0.2)", stroke: "#3b82f6", strokeWidth: "2", className: "transition-all duration-1000 ease-out" }), points.map((point, index) => (_jsx("circle", { cx: point.x, cy: point.y, r: "4", fill: "#3b82f6", className: "transition-all duration-1000 ease-out" }, index))), metrics.map((metric, index) => {
                            const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
                            const labelRadius = radius + 25;
                            const x = centerX + Math.cos(angle) * labelRadius;
                            const y = centerY + Math.sin(angle) * labelRadius;
                            return (_jsx("text", { x: x, y: y, textAnchor: "middle", dominantBaseline: "middle", className: "fill-gray-700 text-xs font-medium", transform: `rotate(${angle * 180 / Math.PI > 90 ? angle * 180 / Math.PI + 180 : angle * 180 / Math.PI}, ${x}, ${y})`, children: metric.label }, index));
                        })] }) }), _jsx("div", { className: "mt-4 grid grid-cols-2 gap-2 text-xs", children: metrics.map((metric, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-gray-600", children: [metric.label, ":"] }), _jsxs("span", { className: "font-semibold text-gray-900", children: [Math.round(metric.value * 100), "%"] })] }, index))) })] }));
};
// Data Source Quality Grid
const DataSourceGrid = ({ sources, maxItems = 4 }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedSources = showAll ? sources : sources.slice(0, maxItems);
    const getQualityColor = (quality) => {
        if (quality >= 0.8)
            return 'bg-green-100 border-green-300 text-green-800';
        if (quality >= 0.6)
            return 'bg-yellow-100 border-yellow-300 text-yellow-800';
        if (quality >= 0.4)
            return 'bg-orange-100 border-orange-300 text-orange-800';
        return 'bg-red-100 border-red-300 text-red-800';
    };
    const getQualityIcon = (quality) => {
        if (quality >= 0.8)
            return _jsx(CheckCircle, { className: "w-4 h-4" });
        if (quality >= 0.6)
            return _jsx(Clock, { className: "w-4 h-4" });
        return _jsx(AlertCircle, { className: "w-4 h-4" });
    };
    return (_jsxs("div", { children: [_jsxs("h4", { className: "text-sm font-semibold text-gray-700 mb-3 flex items-center", children: [_jsx(Database, { className: "w-4 h-4 mr-2" }), "Data Sources Quality"] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: displayedSources.map((source, index) => (_jsxs("div", { className: `border rounded-lg p-3 ${getQualityColor(source.quality)}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [getQualityIcon(source.quality), _jsx("span", { className: "font-semibold text-sm", children: source.name })] }), _jsxs("span", { className: "text-xs font-bold", children: [Math.round(source.quality * 100), "%"] })] }), _jsxs("div", { className: "space-y-1 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Recency:" }), _jsxs("span", { children: [Math.round(source.recency * 100), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Coverage:" }), _jsxs("span", { children: [Math.round(source.coverage * 100), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Sample Size:" }), _jsx("span", { children: source.sampleSize.toLocaleString() })] })] })] }, index))) }), sources.length > maxItems && (_jsx("button", { onClick: () => setShowAll(!showAll), className: "mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium", children: showAll ? 'Show Less' : `Show ${sources.length - maxItems} More` }))] }));
};
// Risk and Strength Factors
const FactorsList = ({ title, factors, type, icon, maxItems = 3 }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedFactors = showAll ? factors : factors.slice(0, maxItems);
    const getTypeColor = (type) => {
        return type === 'risk'
            ? 'border-red-200 bg-red-50'
            : 'border-green-200 bg-green-50';
    };
    const getIconColor = (type) => {
        return type === 'risk' ? 'text-red-600' : 'text-green-600';
    };
    if (factors.length === 0)
        return null;
    return (_jsxs("div", { className: `border rounded-lg p-4 ${getTypeColor(type)}`, children: [_jsxs("h4", { className: `text-sm font-semibold mb-3 flex items-center ${getIconColor(type)}`, children: [icon, _jsx("span", { className: "ml-2", children: title })] }), _jsx("ul", { className: "space-y-2", children: displayedFactors.map((factor, index) => (_jsxs("li", { className: "flex items-start space-x-2", children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${type === 'risk' ? 'bg-red-500' : 'bg-green-500'}` }), _jsx("span", { className: "text-sm text-gray-700", children: factor })] }, index))) }), factors.length > maxItems && (_jsx("button", { onClick: () => setShowAll(!showAll), className: `mt-3 text-sm font-medium ${type === 'risk' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`, children: showAll ? 'Show Less' : `Show ${factors.length - maxItems} More` }))] }));
};
// Main Confidence Metrics Panel Component
const ConfidenceMetricsPanel = ({ data, isLoading = false, compact = false }) => {
    if (isLoading) {
        return (_jsx("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-6 bg-gray-300 rounded w-1/3 mb-4" }), _jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: "w-20 h-20 bg-gray-300 rounded-full" }) }), _jsx("div", { className: "h-32 bg-gray-300 rounded mb-4" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: "h-24 bg-gray-300 rounded" }), _jsx("div", { className: "h-24 bg-gray-300 rounded" })] })] }) }));
    }
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold mb-1", children: "Confidence Analysis" }), _jsx("p", { className: "text-indigo-100 text-sm", children: "Valuation reliability and data quality assessment" })] }), _jsx(Shield, { className: "w-8 h-8 text-indigo-200" })] }), _jsxs("div", { className: "mt-4 grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: [Math.round(data.overallConfidence * 100), "%"] }), _jsx("div", { className: "text-indigo-200 text-sm", children: "Overall" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold", children: [Math.round(data.historicalAccuracy * 100), "%"] }), _jsx("div", { className: "text-indigo-200 text-sm", children: "Historical Accuracy" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: data.dataSources.length }), _jsx("div", { className: "text-indigo-200 text-sm", children: "Data Sources" })] })] })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: `grid ${compact ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'}`, children: [_jsx("div", { className: "flex justify-center", children: _jsx(ConfidenceScoreRing, { score: data.overallConfidence, size: "large", animated: true, showLabel: true }) }), !compact && (_jsx(ConfidenceRadar, { breakdown: data.breakdown, animated: true }))] }), _jsx(DataSourceGrid, { sources: data.dataSources }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(FactorsList, { title: "Risk Factors", factors: data.riskFactors, type: "risk", icon: _jsx(AlertCircle, { className: "w-4 h-4" }) }), _jsx(FactorsList, { title: "Strength Factors", factors: data.strengthFactors, type: "strength", icon: _jsx(CheckCircle, { className: "w-4 h-4" }) })] }), data.recommendations.length > 0 && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsxs("h4", { className: "text-sm font-semibold text-blue-800 mb-3 flex items-center", children: [_jsx(Star, { className: "w-4 h-4 mr-2" }), "Recommendations"] }), _jsx("ul", { className: "space-y-2", children: data.recommendations.map((recommendation, index) => (_jsxs("li", { className: "flex items-start space-x-2", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" }), _jsx("span", { className: "text-sm text-blue-700", children: recommendation })] }, index))) })] })), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center space-x-4 text-xs text-gray-500", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "w-3 h-3 mr-1" }), _jsx("span", { children: "Community Validated" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "w-3 h-3 mr-1" }), _jsx("span", { children: "Regional Data" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "w-3 h-3 mr-1" }), _jsx("span", { children: "Real-time Updates" })] })] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Last validated: ", new Date(data.lastValidated).toLocaleDateString()] })] })] })] }));
};
export default ConfidenceMetricsPanel;
