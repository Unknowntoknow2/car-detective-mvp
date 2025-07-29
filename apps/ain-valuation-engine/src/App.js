import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { VinLookupForm } from "@/components/lookup/vin/VinLookupForm";
import { DataCollectionForm } from "@/components/followup/DataCollectionForm";
import { ValuationResultsDisplay } from "@/components/result/ValuationResultsDisplay";
function App() {
    const [currentState, setCurrentState] = useState('vin-lookup');
    const [decodedVin, setDecodedVin] = useState([]);
    const [valuationResult, setValuationResult] = useState(null);
    const [currentVin, setCurrentVin] = useState('');
    const handleVinDecoded = (data, vin) => {
        console.log("Decoded VIN result:", data);
        setDecodedVin(data);
        setCurrentVin(vin);
        setCurrentState('data-collection');
    };
    const handleDataCollectionComplete = (valuation) => {
        console.log("Valuation completed:", valuation);
        setValuationResult(valuation);
        setCurrentState('valuation-results');
    };
    const handleStartOver = () => {
        setCurrentState('vin-lookup');
        setDecodedVin([]);
        setCurrentVin('');
        setValuationResult(null);
    };
    const renderCurrentState = () => {
        switch (currentState) {
            case 'vin-lookup':
                return (_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "AIN Vehicle Valuation Engine" }), _jsx("p", { className: "text-lg text-gray-600 mb-8 max-w-2xl mx-auto", children: "Get an accurate, AI-powered valuation for your vehicle using comprehensive market analysis, vehicle history, and real-time data from multiple sources." }), _jsx(VinLookupForm, { onSuccess: handleVinDecoded })] }));
            case 'data-collection':
                return (_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Complete Your Vehicle Information" }), _jsx("p", { className: "text-gray-600 mb-8", children: "We need a few more details to provide the most accurate valuation." }), _jsx(DataCollectionForm, { decodedVin: decodedVin, vin: currentVin, onComplete: handleDataCollectionComplete }), _jsx("button", { onClick: handleStartOver, className: "mt-6 text-blue-600 hover:text-blue-800 underline", children: "Start Over with Different VIN" })] }));
            case 'valuation-results':
                return (_jsxs("div", { children: [valuationResult && _jsx(ValuationResultsDisplay, { valuation: valuationResult }), _jsx("div", { className: "text-center mt-8", children: _jsx("button", { onClick: handleStartOver, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium", children: "Value Another Vehicle" }) })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("div", { className: "flex items-center", children: _jsx("h1", { className: "text-xl font-bold text-gray-900", children: "AIN Valuation" }) }), currentState !== 'vin-lookup' && (_jsx("button", { onClick: handleStartOver, className: "text-gray-600 hover:text-gray-900", children: "New Valuation" }))] }) }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: renderCurrentState() }), _jsx("footer", { className: "bg-white border-t mt-16", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "text-center text-gray-600", children: [_jsx("p", { className: "mb-2", children: "Powered by advanced AI and comprehensive market data analysis" }), _jsxs("div", { className: "flex justify-center space-x-6 text-sm", children: [_jsx("span", { children: "\u2713 100+ Comparable Analysis" }), _jsx("span", { children: "\u2713 Real-time Market Data" }), _jsx("span", { children: "\u2713 Vehicle History Integration" }), _jsx("span", { children: "\u2713 AI-Powered Explanations" })] })] }) }) })] }));
}
export default App;
