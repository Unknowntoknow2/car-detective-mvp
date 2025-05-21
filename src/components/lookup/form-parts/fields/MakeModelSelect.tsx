import React from 'react';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/ui/combo-box';
import ErrorBoundary from '../../ErrorBoundary';
import { Spinner } from '@/components/ui/spinner';

interface MakeModelSelectProps {
  label: string;
  value: string;
  items: { value: string; label: string }[];
  onChange: (value: string) => void;
  loading?: boolean;
  error?: string;
}

export function MakeModelSelect({
  label,
  value,
  items,
  onChange,
  loading,
  error
}: MakeModelSelectProps) {
  return (
    <div>
      <Label>{label}</Label>
      <ErrorBoundary context={`MakeModelSelect - ${label}`}>
        <ComboBox
          value={value}
          onValueChange={onChange}
          items={items}
          placeholder={`Select ${label.toLowerCase()}`}
          loading={loading}
          error={error}
        />
      </ErrorBoundary>
      {loading && <Spinner />}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
