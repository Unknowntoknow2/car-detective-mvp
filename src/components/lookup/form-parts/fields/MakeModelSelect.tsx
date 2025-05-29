
import React from 'react';
import { ComboBox } from "@/components/ui/combo-box";
import ErrorBoundary from "../../ErrorBoundary";

interface MakeModelSelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
  placeholder: string;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
}

function MakeModelSelectField({
  value,
  onValueChange,
  items,
  placeholder,
  loading = false,
  error,
  disabled = false
}: MakeModelSelectFieldProps) {
  // Convert items to ComboBoxItem format
  const formattedItems = items.map(item => ({
    value: item.value,
    label: item.label
  }));

  return (
    <ErrorBoundary>
      <div className="space-y-1">
        <ComboBox
          value={value}
          onValueChange={onValueChange}
          items={formattedItems}
          placeholder={placeholder}
          disabled={loading || disabled}
          emptyMessage={error || "No options available"}
          loading={loading}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </ErrorBoundary>
  );
}

export default MakeModelSelectField;
