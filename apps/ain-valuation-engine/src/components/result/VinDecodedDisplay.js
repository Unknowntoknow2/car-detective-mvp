import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const isValidValue = (val) => {
    return val !== 'N/A' && val !== null && val !== '';
};
const VinDecodedDisplay = ({ data }) => {
    const entries = Object.entries(data).filter(([_, val]) => isValidValue(val));
    return (_jsxs("div", { className: "p-6 rounded-md bg-white shadow-lg w-full max-w-6xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Decoded VIN Details" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm", children: entries.map(([key, value]) => (_jsxs("div", { className: "bg-gray-50 border p-3 rounded-md", children: [_jsx("div", { className: "text-gray-500 font-medium truncate", children: key }), _jsx("div", { className: "text-gray-800 break-words", children: String(value) })] }, key))) })] }));
};
export default VinDecodedDisplay;
