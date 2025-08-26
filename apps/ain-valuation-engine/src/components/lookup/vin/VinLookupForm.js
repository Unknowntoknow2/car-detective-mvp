import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { CarFindCard } from '@/components/CarFindCard';
import { decodeVin, VINDecodeError, isVinDecodeSuccessful } from '@/services/unifiedVinDecoder';
import { convertToVariableValueArray } from '@/utils/convertToVariableValueArray';
export function VinLookupForm({ onSuccess }) {
    const [vin, setVin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [decodedData, setDecodedData] = useState(null);
    const handleDecode = async () => {
        setLoading(true);
        setError(null);
        setDecodedData(null);
        try {
            const result = await decodeVin(vin);
            console.log("🔍 Unified decode result:", result);
            if (!result || !isVinDecodeSuccessful(result)) {
                throw new Error(result?.metadata?.errorText || 'Failed to decode VIN');
            }
            // Convert the unified response to the legacy format for compatibility
            const legacyData = {
                Make: result.categories.identity.make,
                Model: result.categories.identity.model,
                ModelYear: result.categories.identity.modelYear,
                Trim: result.categories.identity.trim,
                BodyClass: result.categories.identity.bodyClass,
                EngineCylinders: result.categories.powertrain.engineCylinders,
                FuelTypePrimary: result.categories.powertrain.fuelTypePrimary,
                DriveType: result.categories.powertrain.driveType,
                TransmissionStyle: result.categories.powertrain.transmissionStyle,
                PlantCountry: result.categories.manufacturing.plantCountry,
                // Include all raw data for completeness
                ...result.raw
            };
            const array = convertToVariableValueArray(legacyData);
            setDecodedData(array);
            onSuccess?.(array, vin);
        }
        catch (err) {
            if (err instanceof VINDecodeError) {
                setError(`VIN Decode Error (${err.code}): ${err.message}`);
            }
            else {
                setError(err instanceof Error ? err.message : 'Unexpected error');
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Input, { value: vin, onChange: (e) => setVin(e.target.value), placeholder: "Enter VIN", maxLength: 17 }), _jsx(Button, { onClick: handleDecode, disabled: loading || vin.length !== 17, children: loading ? 'Decoding...' : 'Decode VIN' })] }), error && (_jsxs("div", { className: "text-red-500 text-sm", children: ["\u274C ", error] })), decodedData && (_jsxs("div", { className: "border rounded p-4 bg-muted", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "VIN Decoded Result:" }), _jsx(CarFindCard, { decoded: decodedData })] }))] }));
}
