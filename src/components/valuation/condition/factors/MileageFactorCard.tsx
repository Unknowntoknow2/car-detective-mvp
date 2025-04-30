
import React from 'react';
import { FactorSlider, ConditionOption } from '../FactorSlider';

const mileageOptions: ConditionOption[] = [
  { value: 0, label: '<20k', tip: 'Up to 20k miles – extra value', multiplier: 1.00 },
  { value: 25, label: '20–40k', tip: '20–40k miles – slight depreciation', multiplier: 0.98 },
  { value: 50, label: '40–60k', tip: '40–60k miles – moderate depreciation', multiplier: 0.95 },
  { value: 75, label: '60–80k', tip: '60–80k miles – higher depreciation', multiplier: 0.92 },
  { value: 100, label: '80k+', tip: '80k+ miles – significant depreciation', multiplier: 0.90 },
];

interface MileageFactorCardProps {
  value: number;
  onChange: (value: number) => void;
}

export function MileageFactorCard({ value, onChange }: MileageFactorCardProps) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Mileage</h3>
      <FactorSlider
        id="mileage-factor"
        label="Mileage Range"
        options={mileageOptions}
        value={value}
        onChange={onChange}
        ariaLabel="Mileage factor"
      />
    </div>
  );
}
