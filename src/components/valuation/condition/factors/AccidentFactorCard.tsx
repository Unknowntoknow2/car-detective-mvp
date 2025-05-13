
import React from 'react';
import { FactorSlider } from '../FactorSlider';

// Define local option type matching the FactorSlider requirements
interface FactorOption {
  id?: string;
  label: string;
  value: number;
  tip?: string;
}

const accidentOptions: FactorOption[] = [
  { value: 0, label: 'None', tip: 'No accidents or damage reported' },
  { value: 25, label: '1 Minor', tip: 'One minor accident with cosmetic damage only' },
  { value: 50, label: '1 Major', tip: 'One major accident with structural or airbag deployment' },
  { value: 75, label: '2+ Minor', tip: 'Multiple minor accidents or damages' },
  { value: 100, label: '2+ Major', tip: 'Multiple major accidents, significant impact on value' },
];

interface AccidentFactorCardProps {
  value: number;
  onChange: (value: number) => void;
}

export function AccidentFactorCard({ value, onChange }: AccidentFactorCardProps) {
  // Wrapper function to match the expected signature
  const handleChange = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Accident History</h3>
      <FactorSlider
        id="accident-factor"
        label="Accident Severity"
        options={accidentOptions}
        value={value}
        onChange={handleChange}
        ariaLabel="Accident history factor"
      />
    </div>
  );
}
