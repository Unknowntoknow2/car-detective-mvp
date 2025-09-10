import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function VinDecodedDetails({ decoded }) {
    return (_jsxs("div", { className: "mt-4 space-y-1", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Decoded VIN Details" }), _jsx("div", { className: "border border-gray-300 rounded p-3 max-h-[400px] overflow-y-auto text-sm", children: decoded.map((item, idx) => (_jsxs("div", { className: "flex justify-between border-b py-1", children: [_jsx("span", { className: "text-gray-700 font-medium", children: item.Variable }), _jsx("span", { className: "text-gray-900", children: item.Value || 'N/A' })] }, idx))) })] }));
}
