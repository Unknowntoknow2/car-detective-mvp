import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function ValuationResultCard({ profile }) {
    const fuel = profile.fuelEconomy;
    return (
        _jsxs("div", { className: "rounded border p-4 space-y-4 shadow-sm bg-white", children: [
            _jsxs("div", {
                children: [
                    _jsx("h2", { className: "text-lg font-bold mb-1", children: "Vehicle Info" }),
                    _jsxs("p", { children: [profile.year, " ", profile.make, " ", profile.model, " ", profile.trim ?? ''] }),
                    _jsxs("p", { className: "text-sm text-gray-500", children: ["VIN: ", profile.vin] })
                ]
            }),
            fuel && (
                _jsxs("div", {
                    children: [
                        _jsx("h3", { className: "font-semibold", children: "Fuel Economy" }),
                        _jsxs("p", { children: ["Combined MPG: ", fuel.combinedMpg ?? 'N/A'] }),
                        _jsxs("p", { children: ["Fuel Type: ", fuel.fuelType] }),
                        _jsxs("p", { children: ["Est. Annual Fuel Cost: $", fuel.fuelCostPerYearUSD?.toFixed(2) ?? 'N/A'] })
                    ]
                })
            ),
            _jsxs("div", {
                children: [
                    _jsx("h3", { className: "font-semibold", children: "Estimated Value" }),
                    _jsxs("p", { className: "text-green-600 font-bold text-xl", children: ["$", profile.marketValueUSD?.toLocaleString() ?? 'TBD'] }),
                    _jsxs("p", { className: "text-sm text-gray-500", children: ["Confidence: ", profile.valuationConfidence ?? 'N/A'] })
                ]
            })
        ] })
    );
}