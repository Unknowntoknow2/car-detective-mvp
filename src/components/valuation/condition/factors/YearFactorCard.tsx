
import React from 'react';
import { FactorSlider, ConditionOption } from '../FactorSlider';

const ageOptions: ConditionOption[] = [
  { value: 0, label: '0–1 yr', tip: 'Brand new (full value)', multiplier: 1.00 },
  { value: 25, label: '2–3 yrs', tip: '2–3 years (approximately -15% per year)', multiplier: 0.85 },
  { value: 50, label: '4–6 yrs', tip: '4–6 years (approximately -30% value)', multiplier: 0.70 },
  { value: 75, label: '7–10 yrs', tip: '7–10 years (approximately -45% value)', multiplier: 0.55 },
  { value: 100, label: '10+ yrs', tip: '10+ years (approximately -60% value)', multiplier: 0.40 },
];

interface YearFactorCardProps {
  value: number;
  onChange: (value: number) => void;
}

export function YearFactorCard({ value, onChange }: YearFactorCardProps) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Vehicle Age</h3>
      <FactorSlider
        id="year-factor"
        label="Age Range"
        options={ageOptions}
        value={value}
        onChange={onChange}
        ariaLabel="Vehicle age factor"
      />
    </div>
  );
}
