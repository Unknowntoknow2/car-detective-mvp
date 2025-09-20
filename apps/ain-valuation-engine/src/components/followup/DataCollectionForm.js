import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from '../../../../src/components/ui/button';
import { Input } from '../../../../src/components/ui/input';
import { VehicleCondition, TitleStatus } from '../../types/ValuationTypes';
import { valuateVehicle } from '@/ain-backend/valuationEngine';
export function DataCollectionForm({ decodedVin, vin, onComplete }) {
    const [vehicleData, setVehicleData] = useState({});
    const [dataGaps, setDataGaps] = useState([]);
    const [currentGapIndex, setCurrentGapIndex] = useState(0);
    const [isCollecting, setIsCollecting] = useState(true);
    const [isGeneratingValuation, setIsGeneratingValuation] = useState(false);
    const [errors, setErrors] = useState({});
    const requiredFields = ['vin', 'year', 'make', 'model', 'mileage', 'condition', 'titleStatus'];
    useEffect(() => {
        // Extract basic vehicle data from decoded VIN
        const extractedData = extractVehicleDataFromVin(decodedVin, vin);
        setVehicleData(extractedData);
        // Identify data gaps that need user input
        const gaps = identifyDataGaps(extractedData);
        setDataGaps(gaps);
        if (gaps.length === 0) {
            setIsCollecting(false);
        }
    }, [decodedVin, vin]);
    function extractVehicleDataFromVin(decoded, vin) {
        const data = { vin };
        // Google-level: log all decoded fields for mapping
        if (decoded && decoded.length > 0) {
            // eslint-disable-next-line no-console
            console.log('[VIN DECODE] All decoded fields:', decoded);
        }
        decoded.forEach(item => {
            const val = item.Value !== undefined && item.Value !== null ? String(item.Value) : undefined;
            switch (item.Variable) {
                case 'Make':
                    data.make = val;
                    break;
                case 'Model':
                    data.model = val;
                    break;
                case 'Model Year':
                    data.year = val ? parseInt(val) : undefined;
                    break;
                case 'Trim':
                    data.trim = val;
                    break;
                case 'Engine Number of Cylinders':
                case 'Engine Displacement (L)':
                case 'Engine Model':
                    data.engineSize = val;
                    break;
                case 'Fuel Type - Primary':
                case 'Fuel Type':
                    data.fuelType = val;
                    break;
                case 'Drive Type':
                case 'Drive':
                    data.drivetrain = val;
                    break;
                case 'Transmission Style':
                case 'Transmission':
                    data.transmission = val;
                    break;
                case 'Body Class':
                    data.body = val;
                    break;
                case 'Doors':
                case 'Number of Doors':
                    data.doors = val ? parseInt(val) : undefined;
                    break;
                case 'Exterior Color':
                case 'Color':
                    data.exteriorColor = val;
                    break;
                case 'Interior Color':
                    data.interiorColor = val;
                    break;
                case 'Plant Country':
                    data.plantCountry = val;
                    break;
                case 'Plant State':
                    data.plantState = val;
                    break;
                case 'Plant City':
                    data.plantCity = val;
                    break;
                // Add more mappings as needed
                default:
                    // Optionally, collect unmapped fields for future mapping
                    break;
            }
        });
        return data;
    }
    function identifyDataGaps(data) {
        const gaps = [];
        if (!data.mileage) {
            gaps.push({
                field: 'mileage',
                required: true,
                prompt: 'What is the current mileage of your vehicle?',
                validationRules: [
                    { type: 'required', message: 'Mileage is required for accurate valuation' },
                    { type: 'min', value: 0, message: 'Mileage cannot be negative' },
                    { type: 'max', value: 999999, message: 'Please enter a valid mileage' }
                ]
            });
        }
        if (!data.zipCode) {
            gaps.push({
                field: 'zipCode',
                required: true,
                prompt: 'What is your ZIP code? (This helps us find local market comparisons)',
                validationRules: [
                    { type: 'required', message: 'ZIP code is required' },
                    { type: 'pattern', value: /^\d{5}(-\d{4})?$/, message: 'Please enter a valid ZIP code' }
                ]
            });
        }
        if (!data.condition) {
            gaps.push({
                field: 'condition',
                required: true,
                prompt: 'What is the overall condition of your vehicle?',
                validationRules: [
                    { type: 'required', message: 'Vehicle condition is required' }
                ]
            });
        }
        if (!data.titleStatus) {
            gaps.push({
                field: 'titleStatus',
                required: true,
                defaultValue: TitleStatus.CLEAN,
                prompt: 'What is the title status of your vehicle?',
                validationRules: [
                    { type: 'required', message: 'Title status is required' }
                ]
            });
        }
        if (!data.exteriorColor) {
            gaps.push({
                field: 'exteriorColor',
                required: false,
                prompt: 'What is the exterior color of your vehicle? (Optional)',
                validationRules: []
            });
        }
        return gaps;
    }
    const handleInputChange = (field, value) => {
        setVehicleData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const validateCurrentInput = () => {
        const currentGap = dataGaps[currentGapIndex];
        if (!currentGap)
            return true;
        const value = vehicleData[currentGap.field];
        const newErrors = {};
        for (const rule of currentGap.validationRules || []) {
            switch (rule.type) {
                case 'required':
                    if (!value || (typeof value === 'string' && value.trim() === '')) {
                        newErrors[currentGap.field] = rule.message;
                    }
                    break;
                case 'min':
                    if (typeof value === 'number' && typeof rule.value === 'number' && value < rule.value) {
                        newErrors[currentGap.field] = rule.message;
                    }
                    break;
                case 'max':
                    if (typeof value === 'number' && typeof rule.value === 'number' && value > rule.value) {
                        newErrors[currentGap.field] = rule.message;
                    }
                    break;
                case 'pattern':
                    if (typeof value === 'string' && rule.value instanceof RegExp && !rule.value.test(value)) {
                        newErrors[currentGap.field] = rule.message;
                    }
                    break;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleNext = () => {
        if (!validateCurrentInput()) {
            return;
        }
        if (currentGapIndex < dataGaps.length - 1) {
            setCurrentGapIndex(prev => prev + 1);
        }
        else {
            setIsCollecting(false);
            generateValuation();
        }
    };
    const handlePrevious = () => {
        if (currentGapIndex > 0) {
            setCurrentGapIndex(prev => prev - 1);
        }
    };
    const generateValuation = async () => {
        setIsGeneratingValuation(true);
        try {
            // Always build a complete VehicleData object from decoded VIN and user input
            const vd = {
                vin: vehicleData.vin,
                year: vehicleData.year,
                make: vehicleData.make,
                model: vehicleData.model,
                trim: vehicleData.trim || undefined,
                mileage: Number(vehicleData.mileage),
                zip: vehicleData.zip,
                condition: vehicleData.condition,
                titleStatus: vehicleData.titleStatus,
                color: vehicleData.color || vehicleData.exteriorColor || undefined,
                fuelType: vehicleData.fuelType,
                transmission: vehicleData.transmission,
                driveType: vehicleData.drivetrain,
            };
            // Strict validation: all required fields must be present, non-empty, and valid
            const required = ['vin', 'year', 'make', 'model', 'mileage', 'condition', 'titleStatus'];
            const missing = required.filter(f => {
                const v = vd[f];
                if (v === undefined || v === null)
                    return true;
                if (typeof v === 'string' && v.trim() === '')
                    return true;
                if (f === 'mileage' && (typeof v !== 'number' || isNaN(v) || v <= 0))
                    return true;
                if (f === 'year' && (typeof v !== 'number' || isNaN(v) || v < 1900))
                    return true;
                return false;
            });
            // Log the full vehicleData for debugging
            // eslint-disable-next-line no-console
            console.log('[Valuation Submission] vehicleData:', vd);
            if (missing.length > 0) {
                alert('Missing or invalid required fields: ' + missing.join(', '));
                setIsGeneratingValuation(false);
                return;
            }
            const result = await valuateVehicle(vd);
            if (result) {
                // Normalize the result to ensure camelCase and required fields
                const normalizeResult = (val) => ({
                    ...val,
                    estimatedValue: val.estimatedValue ?? val.estimated_value ?? val.finalValue ?? null,
                    priceRange: val.priceRange ?? val.range ?? { low: null, high: null },
                    confidence: val.confidence ?? val.confidenceScore ?? null,
                    timestamp: val.timestamp ?? val.createdAt ?? Date.now(),
                });
                onComplete(normalizeResult(result));
            }
            else {
                console.error('Valuation failed');
            }
        }
        catch (error) {
            console.error('Valuation error:', error);
        }
        finally {
            setIsGeneratingValuation(false);
        }
    };
    const renderCurrentInput = () => {
        const currentGap = dataGaps[currentGapIndex];
        if (!currentGap)
            return null;
        const value = vehicleData[currentGap.field];
        const error = errors[currentGap.field];
        switch (currentGap.field) {
            case 'mileage':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Input, { type: "number", placeholder: "Enter mileage (e.g., 45000)", value: String(value ?? ''), onChange: (e) => handleInputChange(currentGap.field, parseInt(e.target.value) || 0), className: error ? 'border-red-500' : '' }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            case 'zipCode':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Input, { placeholder: "Enter ZIP code (e.g., 90210)", value: String(value ?? ''), onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: error ? 'border-red-500' : '', maxLength: 10 }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            case 'condition':
                return (_jsxs("div", { className: "space-y-2", children: [_jsxs("select", { value: String(value ?? ''), onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: `w-full p-3 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`, children: [_jsx("option", { value: "", children: "Select condition" }), _jsx("option", { value: VehicleCondition.EXCELLENT, children: "Excellent - Like new, no visible wear" }), _jsx("option", { value: VehicleCondition.VERY_GOOD, children: "Very Good - Minor wear, well maintained" }), _jsx("option", { value: VehicleCondition.GOOD, children: "Good - Normal wear, good condition" }), _jsx("option", { value: VehicleCondition.FAIR, children: "Fair - Some wear, needs minor repairs" }), _jsx("option", { value: VehicleCondition.POOR, children: "Poor - Significant wear, needs major repairs" })] }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            case 'titleStatus':
                return (_jsxs("div", { className: "space-y-2", children: [_jsxs("select", { value: String(value ?? TitleStatus.CLEAN), onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: `w-full p-3 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`, children: [_jsx("option", { value: TitleStatus.CLEAN, children: "Clean Title" }), _jsx("option", { value: TitleStatus.SALVAGE, children: "Salvage Title" }), _jsx("option", { value: TitleStatus.REBUILT, children: "Rebuilt Title" }), _jsx("option", { value: TitleStatus.FLOOD, children: "Flood Damage" }), _jsx("option", { value: TitleStatus.LEMON, children: "Lemon Title" }), _jsx("option", { value: TitleStatus.MANUFACTURER_BUYBACK, children: "Manufacturer Buyback" })] }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            case 'exteriorColor':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Input, { placeholder: "Enter exterior color (e.g., White, Black, Silver)", value: String(value ?? ''), onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: error ? 'border-red-500' : '' }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            default:
                return (_jsx(Input, { placeholder: `Enter ${currentGap.field}`, value: String(value ?? ''), onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: error ? 'border-red-500' : '' }));
        }
    };
    if (isGeneratingValuation) {
        return (_jsxs("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: "Generating Your Valuation" }), _jsx("p", { className: "text-gray-600", children: "We're analyzing market data and vehicle history to provide you with the most accurate valuation..." })] }));
    }
    if (!isCollecting) {
        // Check for missing required fields
        const missing = requiredFields.filter(f => !vehicleData[f]);
        return (_jsxs("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Data Collection Complete" }), _jsx("p", { className: "text-gray-600 mb-4", children: missing.length === 0
                        ? 'We have all the information needed to generate your valuation.'
                        : _jsxs("span", { className: "text-red-600", children: ["Missing required fields: ", missing.join(', ')] }) }), _jsx(Button, { onClick: generateValuation, className: "w-full", disabled: missing.length > 0, children: "Generate Valuation Report" })] }));
    }
    const currentGap = dataGaps[currentGapIndex];
    const progress = ((currentGapIndex) / dataGaps.length) * 100;
    return (_jsxs("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsxs("span", { children: ["Step ", currentGapIndex + 1, " of ", dataGaps.length] }), _jsxs("span", { children: [Math.round(progress), "% complete"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: currentGap?.prompt }), renderCurrentInput(), !currentGap?.required && (_jsx("p", { className: "text-sm text-gray-500 mt-2", children: "This field is optional but helps improve valuation accuracy." }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", onClick: handlePrevious, disabled: currentGapIndex === 0, children: "Previous" }), _jsx(Button, { onClick: handleNext, disabled: currentGap?.required && !vehicleData[currentGap.field], children: currentGapIndex === dataGaps.length - 1 ? 'Complete' : 'Next' })] }), _jsxs("div", { className: "mt-6 p-4 bg-gray-50 rounded-md", children: [_jsx("h4", { className: "font-medium mb-2", children: "Vehicle Information" }), _jsxs("p", { className: "text-sm text-gray-600", children: [vehicleData.year, " ", vehicleData.make, " ", vehicleData.model, vehicleData.trim && ` ${vehicleData.trim}`] }), vehicleData.mileage && (_jsxs("p", { className: "text-sm text-gray-600", children: ["Mileage: ", vehicleData.mileage.toLocaleString(), " miles"] }))] })] }));
}
