import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { TrendingUp, Thermometer, Activity, Eye, DollarSign, Clock } from 'lucide-react';
// Market Temperature Gauge Component
const MarketTemperatureGauge = ({ temperature, score, animated = true }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setAnimatedScore(score), 100);
            return () => clearTimeout(timer);
        }
        else {
            setAnimatedScore(score);
        }
    }, [score, animated]);
    const getTemperatureColor = (temp) => {
        switch (temp) {
            case 'hot': return 'text-red-600 bg-red-100';
            case 'warm': return 'text-orange-600 bg-orange-100';
            case 'cool': return 'text-blue-600 bg-blue-100';
            case 'cold': return 'text-blue-800 bg-blue-200';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    const getGaugeColor = (temp) => {
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
    return (_jsxs("div", { className: "flex flex-col items-center space-y-3", children: [_jsxs("div", { className: "relative w-24 h-24", children: [_jsxs("svg", { className: "w-24 h-24 transform -rotate-90", viewBox: "0 0 100 100", children: [_jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "currentColor", strokeWidth: "8", fill: "none", className: "text-gray-200" }), _jsx("circle", { cx: "50", cy: "50", r: "45", stroke: "currentColor", strokeWidth: "8", fill: "none", className: `${getGaugeColor(temperature)} transition-all duration-1000 ease-out`, strokeDasharray: strokeDasharray, strokeLinecap: "round" })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx("span", { className: "text-2xl font-bold text-gray-900", children: animatedScore }), _jsx("span", { className: "text-xs text-gray-500", children: "score" })] })] }), _jsxs("div", { className: `px-3 py-1 rounded-full text-sm font-semibold capitalize ${getTemperatureColor(temperature)}`, children: [_jsx(Thermometer, { className: "inline w-4 h-4 mr-1" }), temperature, " Market"] })] }));
};
// Metric Display Component
const MetricDisplay = ({ icon, label, value, trend, confidence, className = '' }) => {
    const getTrendIcon = () => {
        if (!trend)
            return null;
        return (_jsx("span", { className: `ml-2 text-xs ${trend === 'up' ? 'text-green-600' :
                trend === 'down' ? 'text-red-600' :
                    'text-gray-600'}`, children: trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→' }));
    };
    return (_jsxs("div", { className: `bg-white rounded-lg p-4 border border-gray-200 ${className}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center text-gray-600", children: [icon, _jsx("span", { className: "ml-2 text-sm font-medium", children: label })] }), confidence && (_jsxs("span", { className: "text-xs text-gray-500", children: [Math.round(confidence * 100), "% confidence"] }))] }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "text-lg font-semibold text-gray-900 capitalize", children: value }), getTrendIcon()] })] }));
};
// Regional Insights List Component
const RegionalInsightsList = ({ insights, maxItems = 3 }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedInsights = showAll ? insights : insights.slice(0, maxItems);
    if (insights.length === 0) {
        return (_jsx("div", { className: "text-sm text-gray-500 italic", children: "No regional insights available" }));
    }
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Regional Factors" }), _jsx("ul", { className: "space-y-2", children: displayedInsights.map((insight, index) => (_jsxs("li", { className: "flex items-start space-x-2", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" }), _jsx("span", { className: "text-sm text-gray-700", children: insight })] }, index))) }), insights.length > maxItems && (_jsx("button", { onClick: () => setShowAll(!showAll), className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: showAll ? 'Show Less' : `Show ${insights.length - maxItems} More` }))] }));
};
// Live Data Indicator Component
const LiveDataIndicator = ({ lastUpdated, isConnected = true }) => {
    const [timeAgo, setTimeAgo] = useState('');
    useEffect(() => {
        const updateTimeAgo = () => {
            const now = new Date();
            const updated = new Date(lastUpdated);
            const diffInMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
            if (diffInMinutes < 1) {
                setTimeAgo('just now');
            }
            else if (diffInMinutes < 60) {
                setTimeAgo(`${diffInMinutes}m ago`);
            }
            else {
                const hours = Math.floor(diffInMinutes / 60);
                setTimeAgo(`${hours}h ago`);
            }
        };
        updateTimeAgo();
        const interval = setInterval(updateTimeAgo, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [lastUpdated]);
    return (_jsxs("div", { className: "flex items-center space-x-2 text-xs text-gray-500", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}` }), _jsx(Clock, { className: "w-3 h-3" }), _jsxs("span", { children: ["Updated ", timeAgo] })] }));
};
// Main Market Intelligence Panel Component
const MarketIntelligencePanel = ({ data, vehicle, isLoading = false, compact = false }) => {
    if (isLoading) {
        return (_jsx("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-6 bg-gray-300 rounded w-1/3 mb-4" }), _jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: "w-24 h-24 bg-gray-300 rounded-full" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: "h-16 bg-gray-300 rounded" }), _jsx("div", { className: "h-16 bg-gray-300 rounded" })] })] }) }));
    }
    return (_jsxs("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold mb-1", children: "Market Intelligence" }), _jsxs("p", { className: "text-blue-100 text-sm", children: [vehicle.year, " ", vehicle.make, " ", vehicle.model, vehicle.trim && ` ${vehicle.trim}`] })] }), _jsx(TrendingUp, { className: "w-8 h-8 text-blue-200" })] }) }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex justify-center mb-8", children: _jsx(MarketTemperatureGauge, { temperature: data.marketTemperature, score: data.marketScore, animated: true }) }), _jsxs("div", { className: `grid ${compact ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'} mb-6`, children: [_jsx(MetricDisplay, { icon: _jsx(Activity, { className: "w-4 h-4" }), label: "Sales Momentum", value: data.salesMomentum, trend: data.salesMomentum === 'strong' ? 'up' :
                                    data.salesMomentum === 'weak' ? 'down' : 'stable', confidence: data.dataQuality }), _jsx(MetricDisplay, { icon: _jsx(Eye, { className: "w-4 h-4" }), label: "Consumer Interest", value: data.consumerInterest, confidence: data.dataQuality }), !compact && (_jsxs(_Fragment, { children: [_jsx(MetricDisplay, { icon: _jsx(DollarSign, { className: "w-4 h-4" }), label: "Price Stability", value: data.priceStability, trend: data.priceStability === 'stable' ? 'stable' :
                                            data.priceStability === 'volatile' ? 'down' : 'down', confidence: data.dataQuality }), _jsx(MetricDisplay, { icon: _jsx(TrendingUp, { className: "w-4 h-4" }), label: "Market Liquidity", value: data.marketLiquidity, confidence: data.dataQuality })] }))] }), data.regionalFactors.length > 0 && (_jsx("div", { className: "border-t border-gray-200 pt-6", children: _jsx(RegionalInsightsList, { insights: data.regionalFactors, maxItems: compact ? 2 : 3 }) })), _jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Data Quality:" }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("div", { className: "w-16 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-green-500 h-2 rounded-full transition-all duration-300", style: { width: `${data.dataQuality * 100}%` } }) }), _jsxs("span", { className: "text-xs font-medium text-gray-700", children: [Math.round(data.dataQuality * 100), "%"] })] })] }), _jsx(LiveDataIndicator, { lastUpdated: data.lastUpdated })] })] })] }));
};
export default MarketIntelligencePanel;
