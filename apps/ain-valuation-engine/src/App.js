import { jsx as _jsx } from "react/jsx-runtime";
import { VinLookupForm } from "@/components/lookup/vin/VinLookupForm";
function App() {
    const handleDecodedVin = (data) => {
        console.log("Decoded VIN result:", data);
        // TODO: Navigate to follow-up form or store in state
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6 flex items-center justify-center", children: _jsx(VinLookupForm, { onSuccess: handleDecodedVin }) }));
}
export default App;
