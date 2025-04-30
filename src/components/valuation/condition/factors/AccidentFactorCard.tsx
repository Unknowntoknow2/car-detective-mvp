
import React from 'react';
import { FactorSlider, ConditionOption } from '../FactorSlider';

const accidentOptions: ConditionOption[] = [
  { value: 0, label: 'No Accidents', tip: 'No accidents – full value', multiplier: 1.00 },
  { value: 25, label: '1 Accident', tip: '1 accident (approximately -5% value)', multiplier: 0.95 },
  { value: 50, label: '2 Accidents', tip: '2 accidents (approximately -10% value)', multiplier: 0.90 },
  { value: 75, label: '3 Accidents', tip: '3 accidents (approximately -15% value)', multiplier: 0.85 },
  { value: 100, label: '4+ Accidents', tip: '4+ accidents (approximately -25% value)', multiplier: 0.75 },
];

interface AccidentFactorCardProps {
  value: number;
  onChange: (value: number) => void;
}

export function AccidentFactorCard({ value, onChange }: AccidentFactorCardProps) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Accident History</h3>
      <FactorSlider
        id="accident-factor"
        label="Accident Count"
        options={accidentOptions}
        value={value}
        onChange={onChange}
        ariaLabel="Accident count factor"
      />
    </div>
  );
}
