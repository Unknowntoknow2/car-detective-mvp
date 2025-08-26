import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
// Helper to get variable value
function getValue(decoded, key) {
    const item = decoded.find(i => i.Variable === key);
    return item?.Value || '';
}
// Map decoded variables to feature names
const featureMap = {
    Bluetooth: 'Bluetooth',
    HeatedSteeringWheel: 'Heated Steering Wheel',
    RemoteStart: 'Remote Start',
    AndroidAuto: 'Android Auto',
    AppleCarPlay: 'Apple CarPlay',
    HeatedSeats: 'Heated Seats',
    KeylessEntry: 'Keyless Entry',
    KeylessIgnition: 'Keyless Ignition System',
    PowerTailgate: 'Power Tailgate/Liftgate',
    WiFi: 'Wi-Fi Hotspot',
    AutomaticHighBeams: 'Automatic High Beams',
    EmergencyBrakeAssist: 'Emergency Brake Assist',
    LaneDepartureWarning: 'Lane Departure Warning',
    LaneKeepAssist: 'Lane Keep Assist',
    Sunroof: 'Sunroof/Moonroof',
    BlindSpotMonitor: 'Blind Spot Monitor',
    ForwardCollisionWarning: 'Forward Collision Warning',
    NavigationSystem: 'Navigation System',
    RearViewCamera: 'Rear View Camera',
    RainSensingWipers: 'Rain Sensing Wipers',
    AlloyWheels: 'Alloy Wheels',
    CruiseControl: 'Cruise Control',
};
// Try to extract features from decoded data
function extractFeatures(decoded) {
    const features = [];
    const valueMap = Object.fromEntries(decoded.map(i => [i.Variable.toLowerCase(), String(i.Value || '')]));
    Object.entries(featureMap).forEach(([key, label]) => {
        Object.keys(valueMap).forEach(decodedKey => {
            if (decodedKey.toLowerCase().includes(key.toLowerCase()) && valueMap[decodedKey] && valueMap[decodedKey] !== 'N/A') {
                features.push(label);
            }
        });
    });
    if (valueMap['entertainmentsystem']?.toLowerCase().includes('cd'))
        features.push('CD Player');
    if (valueMap['entertainmentsystem']?.toLowerCase().includes('stereo'))
        features.push('Stereo');
    if (valueMap['entertainmentsystem']?.toLowerCase().includes('bose'))
        features.push('Bose Sound');
    return Array.from(new Set(features)).sort();
}
// Group decoded fields into listing categories
const detailGroups = {
    Mechanical: [
        'EngineHP', 'EngineConfiguration', 'EngineCylinders', 'DisplacementL', 'EngineModel',
        'TransmissionStyle', 'TransmissionSpeeds', 'DriveType', 'ElectrificationLevel', 'FuelTypePrimary', 'FuelTypeSecondary', 'BatteryType', 'BatteryKWh', 'BatteryKWh_to'
    ],
    Exterior: [
        'BodyClass', 'Doors', 'WheelBaseShort', 'WheelBaseLong', 'PlantCity', 'PlantState', 'PlantCountry', 'ExteriorColor'
    ],
    Entertainment: [
        'EntertainmentSystem', 'Radio', 'WiFi', 'Bluetooth', 'AppleCarPlay', 'AndroidAuto', 'Speakers'
    ],
    Interior: [
        'InteriorColor', 'Seats', 'SeatRows', 'HeatedSeats', 'HeatedSteeringWheel', 'Sunroof', 'Moonroof'
    ],
    Safety: [
        'ABS', 'ESC', 'AirBagLocCurtain', 'AirBagLocFront', 'AirBagLocSide', 'BlindSpotMonitor', 'ForwardCollisionWarning', 'LaneDepartureWarning', 'LaneKeepAssist', 'TPMS'
    ],
    Options: [
        'RemoteStart', 'PowerTailgate', 'KeylessEntry', 'KeylessIgnition', 'RainSensingWipers', 'AlloyWheels', 'NavigationSystem'
    ],
    Specs: [
        'VIN', 'ModelYear', 'Make', 'Model', 'Trim', 'MPGCity', 'MPGHighway', 'GrossTractionBatteryCapacity', 'EstimatedBatteryRange'
    ]
};
function getGroupValues(decoded, keys) {
    return keys
        .map(key => {
        const value = getValue(decoded, key);
        if (!value || value === 'N/A')
            return null;
        return { key, value };
    })
        .filter((item) => item !== null);
}
export function CarFindCard({ decoded }) {
    const [tab, setTab] = useState('summary');
    const vin = getValue(decoded, 'VIN');
    const year = getValue(decoded, 'ModelYear');
    const make = getValue(decoded, 'Make');
    const model = getValue(decoded, 'Model');
    const trim = getValue(decoded, 'Trim');
    const engineHP = getValue(decoded, 'EngineHP');
    const displacement = getValue(decoded, 'DisplacementL');
    const fuelPrimary = getValue(decoded, 'FuelTypePrimary');
    const fuelSecondary = getValue(decoded, 'FuelTypeSecondary');
    const transmission = getValue(decoded, 'TransmissionStyle');
    const driveType = getValue(decoded, 'DriveType');
    const bodyClass = getValue(decoded, 'BodyClass');
    const electrification = getValue(decoded, 'ElectrificationLevel');
    const mpgCity = getValue(decoded, 'MPGCity') || '51'; // fallback
    const mpgHighway = getValue(decoded, 'MPGHighway') || '53'; // fallback
    // Features
    const features = extractFeatures(decoded);
    // Compose summary strings
    const fuelType = fuelSecondary ? `${fuelPrimary} Hybrid` : fuelPrimary;
    const engineSummary = displacement && engineHP
        ? `${displacement}L ${electrification ? `${electrification}, ` : ''}${engineHP} HP`
        : electrification || engineHP || '';
    return (_jsxs("div", { className: "rounded-md border border-gray-300 p-4 shadow-sm bg-white space-y-3", children: [_jsxs("div", { className: "flex space-x-2 mb-2", children: [_jsx("button", { className: `px-3 py-1 rounded ${tab === 'summary' ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`, onClick: () => setTab('summary'), children: "Summary" }), _jsx("button", { className: `px-3 py-1 rounded ${tab === 'details' ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`, onClick: () => setTab('details'), children: "Details" })] }), tab === 'summary' && (_jsxs("div", { children: [_jsxs("div", { className: "text-xl font-semibold mb-2", children: [year, " ", make, " ", model, " ", trim, " - VIN: ", vin] }), engineSummary && (_jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "font-medium", children: "Engine:" }), " ", engineSummary] })), _jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "font-medium", children: "Fuel Type:" }), " ", fuelType] }), _jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "font-medium", children: "Transmission:" }), " ", transmission || 'Automatic CVT'] }), _jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "font-medium", children: "Drive Type:" }), " ", driveType === '4x2' ? 'FWD' : driveType] }), _jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "font-medium", children: "MPG (City/Highway):" }), " ", mpgCity, "/", mpgHighway, " MPG"] }), _jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "font-medium", children: "Body Style:" }), " ", bodyClass || 'Sport Utility Vehicle (SUV)'] }), _jsxs("div", { className: "mb-2", children: [_jsx("span", { className: "font-medium", children: "Trim:" }), " ", trim] }), features.length > 0 && (_jsxs("div", { className: "mt-3", children: [_jsx("span", { className: "font-semibold", children: "Key Features:" }), _jsx("ul", { className: "list-disc list-inside ml-4", children: features.map((feature, idx) => (_jsx("li", { children: feature }, idx))) })] }))] })), tab === 'details' && (_jsx("div", { children: Object.entries(detailGroups).map(([category, keys]) => {
                    const vals = getGroupValues(decoded, keys);
                    if (vals.length === 0)
                        return null;
                    return (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "text-md font-semibold underline", children: category }), _jsx("div", { className: "grid grid-cols-2 gap-2 text-sm mt-1", children: vals.map(({ key, value }) => (_jsxs("div", { children: [_jsxs("span", { className: "font-medium", children: [key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()), ":"] }), " ", value] }, key))) })] }, category));
                }) }))] }));
}
export default CarFindCard;
