'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CarFindCard } from '@/components/CarFindCard';
import { decodeVin } from '@/api/decodeVin';
import { convertToVariableValueArray } from '@/utils/convertToVariableValueArray';
export function VinLookupForm({ onSuccess, decoded }) {
    const [vin, setVin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [decodedData, setDecodedData] = useState(null);
    const handleDecode = async () => {
        setLoading(true);
        setError(null);
        setDecodedData(null);
        try {
            const data = await decodeVin(vin);
            console.log("🔍 Raw decode:", data.decodedData[0]);
            if (!data || !data.decodedData) {
                throw new Error('Failed to decode VIN');
            }
            const array = convertToVariableValueArray(data.decodedData[0]);
            setDecodedData(array);
            onSuccess?.(array);
        }
        catch (err) {
            setError(err.message || 'Unexpected error');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: vin, onChange: (e) => setVin(e.target.value), placeholder: "Enter VIN (e.g., 1FTEW1CG6HKD46234)", maxLength: 17 }), _jsx(Button, { onClick: handleDecode, disabled: loading || vin.length !== 17, children: loading ? 'Decoding...' : 'Decode VIN' })] }), error && (_jsxs("div", { className: "text-red-500 text-sm", children: ["\u274C ", error] })), decodedData && (_jsxs("div", { className: "border rounded p-4 bg-muted", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "VIN Decoded Result:" }), _jsx(CarFindCard, { decoded: decodedData })] }))] }));
}
