
import React from 'react';
import { FactorSlider } from '../FactorSlider';

// Define local option type matching the FactorSlider requirements
interface FactorOption {
  id?: string;
  label: string;
  value: number;
  tip?: string;
}

const mileageOptions: FactorOption[] = [
  { value: 0, label: '<20k', tip: 'Up to 20k miles – extra value' },
  { value: 25, label: '20–40k', tip: '20–40k miles – slight depreciation' },
  { value: 50, label: '40–60k', tip: '40–60k miles – moderate depreciation' },
  { value: 75, label: '60–80k', tip: '60–80k miles – higher depreciation' },
  { value: 100, label: '80k+', tip: '80k+ miles – significant depreciation' },
];

interface MileageFactorCardProps {
  value: number;
  onChange: (value: number) => void;
}

export function MileageFactorCard({ value, onChange }: MileageFactorCardProps) {
  // Wrapper function to match the expected signature
  const handleChange = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Mileage</h3>
      <FactorSlider
        id="mileage-factor"
        label="Mileage Range"
        options={mileageOptions}
        value={value}
        onChange={handleChange}
        ariaLabel="Mileage factor"
      />
    </div>
  );
}
