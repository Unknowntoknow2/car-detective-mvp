import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * CarFindCard
 * Displays decoded VIN variable/value pairs
 */
export function CarFindCard({ decoded }) {
    return (_jsx("div", { className: "space-y-1", children: decoded.map((item, index) => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "font-medium", children: [item.Variable, ":"] }), _jsx("span", { children: item.Value || 'N/A' })] }, index))) }));
}
