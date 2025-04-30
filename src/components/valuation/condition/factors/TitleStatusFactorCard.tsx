
import React from 'react';
import { FactorSlider, ConditionOption } from '../FactorSlider';

const titleStatusOptions: ConditionOption[] = [
  { value: 0, label: 'Clean', tip: 'Clean title – full market value', multiplier: 1.00 },
  { value: 25, label: 'Rebuilt', tip: 'Rebuilt/Revived title (approximately -30% value)', multiplier: 0.70 },
  { value: 50, label: 'Lemon', tip: 'Lemon/Buyback title (approximately -25% value)', multiplier: 0.75 },
  { value: 75, label: 'Theft', tip: 'Branded (theft recovered) title (approximately -20% value)', multiplier: 0.80 },
  { value: 100, label: 'Salvage', tip: 'Salvage/Flood title (approximately -50% value)', multiplier: 0.50 },
];

interface TitleStatusFactorCardProps {
  value: number;
  onChange: (value: number) => void;
}

export function TitleStatusFactorCard({ value, onChange }: TitleStatusFactorCardProps) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white">
      <h3 className="text-xl font-semibold mb-4">Title Status</h3>
      <FactorSlider
        id="title-status-factor"
        label="Title Status"
        options={titleStatusOptions}
        value={value}
        onChange={onChange}
        ariaLabel="Title status factor"
      />
    </div>
  );
}
