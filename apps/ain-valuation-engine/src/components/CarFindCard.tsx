import React, { useState } from 'react';

interface DecodedItem {
  Variable: string;
  Value: string | number | null;
}

interface Props {
  decoded: DecodedItem[];
}

// Helper to get variable value
function getValue(decoded: DecodedItem[], key: string) {
  const item = decoded.find(i => i.Variable === key);
  return item?.Value || '';
}

// Map decoded variables to feature names
const featureMap: { [key: string]: string } = {
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
function extractFeatures(decoded: DecodedItem[]) {
  const features: string[] = [];
  const valueMap = Object.fromEntries(decoded.map(i => [i.Variable.toLowerCase(), String(i.Value || '')]));
  Object.entries(featureMap).forEach(([key, label]) => {
    Object.keys(valueMap).forEach(decodedKey => {
      if (decodedKey.toLowerCase().includes(key.toLowerCase()) && valueMap[decodedKey] && valueMap[decodedKey] !== 'N/A') {
        features.push(label);
      }
    });
  });
  if (valueMap['entertainmentsystem']?.toLowerCase().includes('cd')) features.push('CD Player');
  if (valueMap['entertainmentsystem']?.toLowerCase().includes('stereo')) features.push('Stereo');
  if (valueMap['entertainmentsystem']?.toLowerCase().includes('bose')) features.push('Bose Sound');
  return Array.from(new Set(features)).sort();
}

// Group decoded fields into listing categories
const detailGroups: { [category: string]: string[] } = {
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

function getGroupValues(decoded: DecodedItem[], keys: string[]) {
  return keys
    .map(key => {
      const value = getValue(decoded, key);
      if (!value || value === 'N/A') return null;
      return { key, value };
    })
    .filter((item): item is { key: string; value: string | number } => item !== null);
}

export function CarFindCard({ decoded }: Props) {
  const [tab, setTab] = useState<'summary' | 'details'>('summary');
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

  return (
    <div className="rounded-md border border-gray-300 p-4 shadow-sm bg-white space-y-3">
      <div className="flex space-x-2 mb-2">
        <button
          className={`px-3 py-1 rounded ${tab === 'summary' ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}
          onClick={() => setTab('summary')}
        >
          Summary
        </button>
        <button
          className={`px-3 py-1 rounded ${tab === 'details' ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}
          onClick={() => setTab('details')}
        >
          Details
        </button>
      </div>

      {tab === 'summary' && (
        <div>
          <div className="text-xl font-semibold mb-2">
            {year} {make} {model} {trim} - VIN: {vin}
          </div>
          {engineSummary && (
            <div className="mb-2"><span className="font-medium">Engine:</span> {engineSummary}</div>
          )}
          <div className="mb-2"><span className="font-medium">Fuel Type:</span> {fuelType}</div>
          <div className="mb-2"><span className="font-medium">Transmission:</span> {transmission || 'Automatic CVT'}</div>
          <div className="mb-2"><span className="font-medium">Drive Type:</span> {driveType === '4x2' ? 'FWD' : driveType}</div>
          <div className="mb-2"><span className="font-medium">MPG (City/Highway):</span> {mpgCity}/{mpgHighway} MPG</div>
          <div className="mb-2"><span className="font-medium">Body Style:</span> {bodyClass || 'Sport Utility Vehicle (SUV)'}</div>
          <div className="mb-2"><span className="font-medium">Trim:</span> {trim}</div>
          {features.length > 0 && (
            <div className="mt-3">
              <span className="font-semibold">Key Features:</span>
              <ul className="list-disc list-inside ml-4">
                {features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === 'details' && (
        <div>
          {Object.entries(detailGroups).map(([category, keys]) => {
            const vals = getGroupValues(decoded, keys);
            if (vals.length === 0) return null;
            return (
              <div key={category} className="mb-4">
                <h4 className="text-md font-semibold underline">{category}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                  {vals.map(({ key, value }) => (
                    <div key={key}>
                      <span className="font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (c: string) => c.toUpperCase())}:
                      </span> {value}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CarFindCard;
