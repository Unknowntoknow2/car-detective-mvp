
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ManualEntryFormData } from '../types/manualEntry';
import { FormSelect } from './FormSelect';

const fuelTypes = [
  { value: 'Gasoline', label: 'Gasoline' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Electric', label: 'Electric' }
];

const conditions = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

const conditionDescriptions: Record<string, string> = {
  excellent: "Vehicle is like new with no visible issues",
  good: "Vehicle is well maintained with minimal wear",
  fair: "Vehicle has moderate wear and may need minor repairs",
  poor: "Vehicle has significant wear and likely needs repairs"
};

interface ConditionAndFuelInputsProps {
  form: UseFormReturn<ManualEntryFormData>;
}

export const ConditionAndFuelInputs: React.FC<ConditionAndFuelInputsProps> = ({ form }) => {
  const [selectedCondition, setSelectedCondition] = React.useState(form.getValues().condition);

  return (
    <>
      <FormSelect
        form={form}
        name="fuelType"
        label="Fuel Type"
        placeholder="Select fuel type"
        options={fuelTypes}
      />

      <FormSelect
        form={form}
        name="condition"
        label="Condition"
        placeholder="Select condition"
        options={conditions}
        description={selectedCondition ? conditionDescriptions[selectedCondition] : undefined}
        onChange={setSelectedCondition}
      />
    </>
  );
};
