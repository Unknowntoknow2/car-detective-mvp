import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AdditionalDetailsSectionProps {
  hasModifications: boolean;
  onModificationsChange: (checked: boolean) => void;
  hasAccidents: boolean;
  onAccidentsChange: (checked: boolean) => void;
  frameDamage: boolean;
  onFrameDamageChange: (checked: boolean) => void;
  smoking: boolean;
  onSmokingChange: (checked: boolean) => void;
  petDamage: boolean;
  onPetDamageChange: (checked: boolean) => void;
  rust: boolean;
  onRustChange: (checked: boolean) => void;
  hailDamage: boolean;
  onHailDamageChange: (checked: boolean) => void;
  loanBalance: number | null;
  onLoanBalanceChange: (value: number | null) => void;
}

export function AdditionalDetailsSection({
  hasModifications,
  onModificationsChange,
  hasAccidents,
  onAccidentsChange,
  frameDamage,
  onFrameDamageChange,
  smoking,
  onSmokingChange,
  petDamage,
  onPetDamageChange,
  rust,
  onRustChange,
  hailDamage,
  onHailDamageChange,
  loanBalance,
  onLoanBalanceChange,
}: AdditionalDetailsSectionProps) {
  const handleFeatureChange = (checked: boolean) => {
    onModificationsChange(checked);
  };

  const handleDamageChange = (checked: boolean) => {
    onAccidentsChange(checked);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="modifications"
          checked={hasModifications}
          onCheckedChange={handleFeatureChange}
        />
        <Label htmlFor="modifications" className="cursor-pointer">
          Has Modifications
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="accidents"
          checked={hasAccidents}
          onCheckedChange={handleDamageChange}
        />
        <Label htmlFor="accidents" className="cursor-pointer">
          Has Accidents
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="frameDamage"
          checked={frameDamage}
          onCheckedChange={onFrameDamageChange}
        />
        <Label htmlFor="frameDamage" className="cursor-pointer">
          Frame Damage
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="smoking"
          checked={smoking}
          onCheckedChange={onSmokingChange}
        />
        <Label htmlFor="smoking" className="cursor-pointer">
          Smoking
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="petDamage"
          checked={petDamage}
          onCheckedChange={onPetDamageChange}
        />
        <Label htmlFor="petDamage" className="cursor-pointer">
          Pet Damage
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="rust"
          checked={rust}
          onCheckedChange={onRustChange}
        />
        <Label htmlFor="rust" className="cursor-pointer">
          Rust
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="hailDamage"
          checked={hailDamage}
          onCheckedChange={onHailDamageChange}
        />
        <Label htmlFor="hailDamage" className="cursor-pointer">
          Hail Damage
        </Label>
      </div>

      <div>
        <Label htmlFor="loanBalance">Loan Balance</Label>
        <Input
          type="number"
          id="loanBalance"
          value={loanBalance !== null ? loanBalance.toString() : ''}
          onChange={(e) => onLoanBalanceChange(e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="Enter loan balance"
        />
      </div>
    </div>
  );
}
