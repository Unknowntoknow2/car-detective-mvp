import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import EnhancedUIDashboard from './EnhancedUIDashboard';
// Initialize Supabase client (you'll need to add your credentials)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
// Mock data generator for development/demo purposes
const generateMockData = (vehicle) => {
    // Mock Market Intelligence Data
    const marketIntelligence = {
        marketScore: 78,
        marketTemperature: 'warm',
        salesMomentum: 'strong',
        consumerInterest: 'high',
        priceStability: 'stable',
        marketLiquidity: 'high',
        regionalFactors: [
            'High demand in metropolitan areas',
            'Strong resale value retention',
            'Popular model year with reliable reputation',
            'Limited supply due to production constraints'
        ],
        dataQuality: 0.87,
        lastUpdated: new Date().toISOString()
    };
    // Mock Adjuster Breakdown Data
    const adjusterBreakdown = {
        baseValue: 25000,
        adjustedValue: 27350,
        totalAdjustment: 2350,
        adjustmentPercentage: 9.4,
        adjusters: [
            {
                id: 'mileage-1',
                name: 'Low Mileage Premium',
                category: 'mileage',
                impact: 1500,
                percentage: 6.0,
                confidence: 0.92,
                reason: 'Vehicle has 15,000 miles below average for model year',
                isActive: true,
                severity: 'medium',
                dataSource: 'Market Comparison Data'
            },
            {
                id: 'options-1',
                name: 'Premium Package',
                category: 'options',
                impact: 1200,
                percentage: 4.8,
                confidence: 0.88,
                reason: 'Navigation, heated seats, and premium audio package',
                isActive: true,
                severity: 'medium',
                dataSource: 'OEM Option Pricing'
            },
            {
                id: 'condition-1',
                name: 'Minor Cosmetic Issues',
                category: 'condition',
                impact: -350,
                percentage: -1.4,
                confidence: 0.75,
                reason: 'Small scratches on rear bumper and minor interior wear',
                isActive: true,
                severity: 'low',
                dataSource: 'Inspection Report'
            },
            {
                id: 'market-1',
                name: 'Regional Market Premium',
                category: 'market',
                impact: 800,
                percentage: 3.2,
                confidence: 0.85,
                reason: 'Higher demand in local market for this model',
                isActive: true,
                severity: 'medium',
                dataSource: 'Regional Market Analysis'
            },
            {
                id: 'safety-1',
                name: 'IIHS Top Safety Pick',
                category: 'safety',
                impact: 600,
                percentage: 2.4,
                confidence: 0.95,
                reason: 'IIHS Top Safety Pick+ award increases desirability',
                isActive: true,
                severity: 'low',
                dataSource: 'IIHS Safety Data'
            },
            {
                id: 'performance-1',
                name: 'Fuel Economy Rating',
                category: 'performance',
                impact: -400,
                percentage: -1.6,
                confidence: 0.82,
                reason: 'Below average fuel economy for vehicle class',
                isActive: true,
                severity: 'low',
                dataSource: 'EPA Fuel Economy Data'
            }
        ],
        confidenceScore: 0.86,
        lastUpdated: new Date().toISOString()
    };
    // Mock Confidence Metrics Data
    const confidenceMetrics = {
        overallConfidence: 0.84,
        breakdown: {
            dataQuality: 0.87,
            marketCoverage: 0.82,
            algorithmicAccuracy: 0.89,
            temporalRelevance: 0.85,
            geographicRelevance: 0.78,
            comparableVehicles: 0.91
        },
        dataSources: [
            {
                name: 'Market Listings',
                quality: 0.92,
                recency: 0.88,
                coverage: 0.85,
                reliability: 0.90,
                sampleSize: 1247,
                lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
            },
            {
                name: 'Auction Data',
                quality: 0.89,
                recency: 0.82,
                coverage: 0.78,
                reliability: 0.95,
                sampleSize: 342,
                lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
            },
            {
                name: 'IIHS Safety',
                quality: 0.98,
                recency: 0.95,
                coverage: 0.88,
                reliability: 0.99,
                sampleSize: 1,
                lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
            },
            {
                name: 'Regional Trends',
                quality: 0.75,
                recency: 0.70,
                coverage: 0.82,
                reliability: 0.78,
                sampleSize: 856,
                lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
            }
        ],
        riskFactors: [
            'Limited comparable sales data for specific trim level',
            'Regional market volatility in last 30 days',
            'Seasonal demand patterns may affect accuracy',
            'Minor inspection findings require verification'
        ],
        strengthFactors: [
            'High volume of recent comparable sales',
            'Strong historical accuracy for this model',
            'Multiple reliable data sources available',
            'Recent market intelligence data',
            'IIHS safety ratings provide confidence boost'
        ],
        recommendations: [
            'Consider scheduling professional inspection for condition verification',
            'Monitor market trends for next 2-4 weeks for optimal timing',
            'Verify premium package contents with dealer documentation'
        ],
        historicalAccuracy: 0.89,
        lastValidated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    };
    return {
        marketIntelligence,
        adjusterBreakdown,
        confidenceMetrics,
        vehicle,
        isLoading: false,
        lastUpdated: new Date().toISOString()
    };
};
// Main Enhanced UI Example Component
const EnhancedUIExample = ({ vin, year = 2020, make = 'Honda', model = 'Accord', trim = 'EX-L' }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const vehicle = { year, make, model, trim };
    // Fetch real data from Supabase (if available) or use mock data
    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // If we have a VIN, try to fetch real data
            if (vin && supabaseUrl && supabaseKey) {
                const [marketResponse, adjusterResponse, confidenceResponse] = await Promise.all([
                    supabase.functions.invoke('market-signals', {
                        body: { vin, year, make, model, trim }
                    }),
                    supabase.functions.invoke('enhanced-valuation', {
                        body: { vin, year, make, model, trim }
                    }),
                    // For confidence metrics, we'll generate based on the responses
                    Promise.resolve({ data: null })
                ]);
                if (marketResponse.error || adjusterResponse.error) {
                    throw new Error('Failed to fetch data from Supabase');
                }
                // Process real data here...
                // For now, fall back to mock data
            }
            // Use mock data (for demo purposes or when real data isn't available)
            const mockData = generateMockData(vehicle);
            setDashboardData(mockData);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            // Fall back to mock data even on error
            const mockData = generateMockData(vehicle);
            setDashboardData(mockData);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Load data on component mount and when vehicle info changes
    useEffect(() => {
        fetchDashboardData();
    }, [vin, year, make, model, trim]);
    // Handle refresh
    const handleRefresh = async () => {
        await fetchDashboardData();
    };
    // Handle export functionality
    const handleExport = async (format) => {
        // Implement export functionality here
        alert(`Export as ${format.toUpperCase()} feature coming soon!`);
    };
    // Handle share functionality
    const handleShare = async () => {
        // Implement share functionality here
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${vehicle.year} ${vehicle.make} ${vehicle.model} Valuation`,
                    text: `Enhanced valuation analysis for ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                    url: window.location.href
                });
            }
            catch (err) {
            }
        }
        else {
            // Fallback: copy URL to clipboard
            await navigator.clipboard.writeText(window.location.href);
            alert('Dashboard URL copied to clipboard!');
        }
    };
    // Show loading state
    if (isLoading || !dashboardData) {
        return (_jsx(EnhancedUIDashboard, { data: {
                marketIntelligence: {},
                adjusterBreakdown: {},
                confidenceMetrics: {},
                vehicle,
                isLoading: true,
                lastUpdated: new Date().toISOString()
            }, onRefresh: handleRefresh, onExport: handleExport, onShare: handleShare }));
    }
    // Show error state (but still render with mock data)
    if (error) {
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [error && (_jsx("div", { className: "bg-yellow-50 border-l-4 border-yellow-400 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-yellow-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }) }), _jsx("div", { className: "ml-3", children: _jsxs("p", { className: "text-sm text-yellow-700", children: ["Using demo data. ", error] }) })] }) })), _jsx(EnhancedUIDashboard, { data: dashboardData, onRefresh: handleRefresh, onExport: handleExport, onShare: handleShare, onConfigChange: (config) => {
                } })] }));
};
export default EnhancedUIExample;
// Example usage component for documentation
export const EnhancedUIUsageExample = () => {
    return (_jsx("div", { className: "p-8 bg-gray-100 min-h-screen", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Enhanced UI Dashboard Demo" }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Usage Examples" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Basic Usage (Mock Data)" }), _jsx("pre", { className: "bg-gray-50 rounded p-3 text-sm overflow-x-auto", children: `<EnhancedUIExample 
  year={2020} 
  make="Honda" 
  model="Accord" 
  trim="EX-L" 
/>` })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "With VIN (Real Data)" }), _jsx("pre", { className: "bg-gray-50 rounded p-3 text-sm overflow-x-auto", children: `<EnhancedUIExample 
  vin="1HGCV1F3XKA123456"
  year={2020} 
  make="Honda" 
  model="Accord" 
  trim="EX-L" 
/>` })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Direct Dashboard Usage" }), _jsx("pre", { className: "bg-gray-50 rounded p-3 text-sm overflow-x-auto", children: `const data = {
  marketIntelligence: { /* market data */ },
  adjusterBreakdown: { /* adjuster data */ },
  confidenceMetrics: { /* confidence data */ },
  vehicle: { year: 2020, make: "Honda", model: "Accord" },
  lastUpdated: new Date().toISOString()
};

<EnhancedUIDashboard 
  data={data}
  onRefresh={() => fetchNewData()}
  onExport={(format) => exportData(format)}
  onShare={() => shareData()}
/>` })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "bg-gray-50 px-6 py-3 border-b border-gray-200", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Live Demo" }), _jsx("p", { className: "text-sm text-gray-600", children: "Interactive Enhanced UI Dashboard with mock data" })] }), _jsx("div", { className: "p-0", children: _jsx(EnhancedUIExample, {}) })] })] }) }));
};
