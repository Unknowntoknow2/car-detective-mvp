
import React from 'react';
import { FactorSlider } from '../FactorSlider';

// Define local option type matching the FactorSlider requirements
interface FactorOption {
  id?: string;
  label: string;
  value: number;
  tip?: string;
}

const ageOptions: FactorOption[] = [
  { value: 0, label: '0–1 yr', tip: 'Brand new (full value)' },
  { value: 25, label: '2–3 yrs', tip: '2–3 years (approximately -15% per year)' },
  { value: 50, label: '4–6 yrs', tip: '4–6 years (approximately -30% value)' },
  { value: 75, label: '7–10 yrs', tip: '7–10 years (approximately -45% value)' },
  { value: 100, label: '10+ yrs', tip: '10+ years (approximately -60% value)' },
];

interface YearFactorCardProps {
  value: number;
  onChange: (value: number) => void;
}

export function YearFactorCard({ value, onChange }: YearFactorCardProps) {
  // Wrapper function to match the expected signature
  const handleChange = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Vehicle Age</h3>
      <FactorSlider
        id="year-factor"
        label="Age Range"
        options={ageOptions}
        value={value}
        onChange={handleChange}
        ariaLabel="Vehicle age factor"
      />
    </div>
  );
}
