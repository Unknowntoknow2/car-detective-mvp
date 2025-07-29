import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VehicleCondition, TitleStatus } from '@/types/ValuationTypes';
import { valuationEngine } from '@/services/valuationEngine';
export function DataCollectionForm({ decodedVin, vin, onComplete }) {
    const [vehicleData, setVehicleData] = useState({});
    const [dataGaps, setDataGaps] = useState([]);
    const [currentGapIndex, setCurrentGapIndex] = useState(0);
    const [isCollecting, setIsCollecting] = useState(true);
    const [isGeneratingValuation, setIsGeneratingValuation] = useState(false);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        // Extract basic vehicle data from decoded VIN
        const extractedData = extractVehicleDataFromVin(decodedVin);
        extractedData.vin = vin; // Set the VIN from props
        setVehicleData(extractedData);
        // Identify data gaps that need user input
        const gaps = identifyDataGaps(extractedData);
        setDataGaps(gaps);
        if (gaps.length === 0) {
            setIsCollecting(false);
        }
    }, [decodedVin, vin]);
    const extractVehicleDataFromVin = (decoded) => {
        const data = {};
        decoded.forEach(item => {
            switch (item.Variable) {
                case 'Make':
                    data.make = item.Value || '';
                    break;
                case 'Model':
                    data.model = item.Value || '';
                    break;
                case 'Model Year':
                    data.year = parseInt(item.Value || '0');
                    break;
                case 'Trim':
                    data.trim = item.Value || undefined;
                    break;
                case 'Body Class':
                    // Could be used to enhance model info
                    break;
                case 'Engine Number of Cylinders':
                    data.engineSize = item.Value || undefined;
                    break;
                case 'Fuel Type - Primary':
                    data.fuelType = item.Value || undefined;
                    break;
                case 'Drive Type':
                    data.drivetrain = item.Value || undefined;
                    break;
                case 'Transmission Style':
                    data.transmission = item.Value || undefined;
                    break;
                default:
                    break;
            }
        });
        // Extract VIN from props
        data.vin = vin;
        return data;
    };
    const identifyDataGaps = (data) => {
        const gaps = [];
        // Critical data gaps that significantly impact valuation
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
        // Optional but helpful data
        if (!data.exteriorColor) {
            gaps.push({
                field: 'exteriorColor',
                required: false,
                prompt: 'What is the exterior color of your vehicle? (Optional)',
                validationRules: []
            });
        }
        return gaps;
    };
    const handleInputChange = (field, value) => {
        setVehicleData(prev => ({ ...prev, [field]: value }));
        // Clear validation error when user starts typing
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
                    if (typeof value === 'number' && value < rule.value) {
                        newErrors[currentGap.field] = rule.message;
                    }
                    break;
                case 'max':
                    if (typeof value === 'number' && value > rule.value) {
                        newErrors[currentGap.field] = rule.message;
                    }
                    break;
                case 'pattern':
                    if (typeof value === 'string' && !rule.value.test(value)) {
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
            // All data collected, proceed to valuation
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
            // Ensure we have VIN from props
            const completeData = {
                ...vehicleData,
                vin: vin,
                make: vehicleData.make || '',
                model: vehicleData.model || '',
                year: vehicleData.year || new Date().getFullYear(),
            };
            console.log('🚀 Generating valuation with data:', completeData);
            const result = await valuationEngine.generateValuation(completeData);
            if (result.success) {
                onComplete(result.data);
            }
            else {
                console.error('Valuation failed:', result.error);
                // Handle error - show error message to user
            }
        }
        catch (error) {
            console.error('Valuation error:', error);
            // Handle error
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
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Input, { type: "number", placeholder: "Enter mileage (e.g., 45000)", value: value || '', onChange: (e) => handleInputChange(currentGap.field, parseInt(e.target.value) || 0), className: error ? 'border-red-500' : '' }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            case 'zipCode':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Input, { placeholder: "Enter ZIP code (e.g., 90210)", value: value || '', onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: error ? 'border-red-500' : '', maxLength: 10 }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            case 'condition':
                return (_jsxs("div", { className: "space-y-2", children: [_jsxs("select", { value: value || '', onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: `w-full p-3 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`, children: [_jsx("option", { value: "", children: "Select condition" }), _jsx("option", { value: VehicleCondition.EXCELLENT, children: "Excellent - Like new, no visible wear" }), _jsx("option", { value: VehicleCondition.VERY_GOOD, children: "Very Good - Minor wear, well maintained" }), _jsx("option", { value: VehicleCondition.GOOD, children: "Good - Normal wear, good condition" }), _jsx("option", { value: VehicleCondition.FAIR, children: "Fair - Some wear, needs minor repairs" }), _jsx("option", { value: VehicleCondition.POOR, children: "Poor - Significant wear, needs major repairs" })] }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            case 'titleStatus':
                return (_jsxs("div", { className: "space-y-2", children: [_jsxs("select", { value: value || TitleStatus.CLEAN, onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: `w-full p-3 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`, children: [_jsx("option", { value: TitleStatus.CLEAN, children: "Clean Title" }), _jsx("option", { value: TitleStatus.SALVAGE, children: "Salvage Title" }), _jsx("option", { value: TitleStatus.REBUILT, children: "Rebuilt Title" }), _jsx("option", { value: TitleStatus.FLOOD, children: "Flood Damage" }), _jsx("option", { value: TitleStatus.LEMON, children: "Lemon Title" }), _jsx("option", { value: TitleStatus.MANUFACTURER_BUYBACK, children: "Manufacturer Buyback" })] }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            case 'exteriorColor':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Input, { placeholder: "Enter exterior color (e.g., White, Black, Silver)", value: value || '', onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: error ? 'border-red-500' : '' }), error && _jsx("p", { className: "text-red-500 text-sm", children: error })] }));
            default:
                return (_jsx(Input, { placeholder: `Enter ${currentGap.field}`, value: value || '', onChange: (e) => handleInputChange(currentGap.field, e.target.value), className: error ? 'border-red-500' : '' }));
        }
    };
    if (isGeneratingValuation) {
        return (_jsxs("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: "Generating Your Valuation" }), _jsx("p", { className: "text-gray-600", children: "We're analyzing market data and vehicle history to provide you with the most accurate valuation..." })] }));
    }
    if (!isCollecting) {
        return (_jsxs("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Data Collection Complete" }), _jsx("p", { className: "text-gray-600 mb-4", children: "We have all the information needed to generate your valuation." }), _jsx(Button, { onClick: generateValuation, className: "w-full", children: "Generate Valuation Report" })] }));
    }
    const currentGap = dataGaps[currentGapIndex];
    const progress = ((currentGapIndex) / dataGaps.length) * 100;
    return (_jsxs("div", { className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsxs("span", { children: ["Step ", currentGapIndex + 1, " of ", dataGaps.length] }), _jsxs("span", { children: [Math.round(progress), "% complete"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: currentGap?.prompt }), renderCurrentInput(), !currentGap?.required && (_jsx("p", { className: "text-sm text-gray-500 mt-2", children: "This field is optional but helps improve valuation accuracy." }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", onClick: handlePrevious, disabled: currentGapIndex === 0, children: "Previous" }), _jsx(Button, { onClick: handleNext, disabled: currentGap?.required && !vehicleData[currentGap.field], children: currentGapIndex === dataGaps.length - 1 ? 'Complete' : 'Next' })] }), _jsxs("div", { className: "mt-6 p-4 bg-gray-50 rounded-md", children: [_jsx("h4", { className: "font-medium mb-2", children: "Vehicle Information" }), _jsxs("p", { className: "text-sm text-gray-600", children: [vehicleData.year, " ", vehicleData.make, " ", vehicleData.model, vehicleData.trim && ` ${vehicleData.trim}`] }), vehicleData.mileage && (_jsxs("p", { className: "text-sm text-gray-600", children: ["Mileage: ", vehicleData.mileage.toLocaleString(), " miles"] }))] })] }));
}
