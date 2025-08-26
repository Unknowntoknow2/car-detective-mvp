import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ValuationResultCard
 * Displays high-priority valuation metrics like VIN basics and fuel economy
 */
export function ValuationResultCard({ profile }) {
    const { vin, year, make, model, trim, fuelEconomy, marketValueUSD } = profile;
    return (_jsxs("div", { className: "rounded-md border border-gray-300 p-4 shadow-sm bg-white space-y-3", children: [_jsx("h2", { className: "text-lg font-bold", children: "Vehicle Summary" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "VIN:" }), " ", vin] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Year / Make / Model:" }), ' ', year, " ", make, " ", model] }), trim && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Trim:" }), " ", trim] })), marketValueUSD && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Estimated Market Value:" }), ' ', "$", marketValueUSD.toLocaleString()] }))] }), fuelEconomy && (_jsxs("div", { className: "pt-3 border-t border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold mb-2", children: "Fuel Economy" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Fuel Type:" }), ' ', fuelEconomy.fuelType] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Combined MPG:" }), ' ', fuelEconomy.combinedMpg ?? 'N/A'] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Estimated Annual Fuel Cost:" }), ' ', fuelEconomy.fuelCostPerYearUSD
                                        ? `$${fuelEconomy.fuelCostPerYearUSD.toFixed(0)}`
                                        : 'N/A'] })] })] }))] }));
}
