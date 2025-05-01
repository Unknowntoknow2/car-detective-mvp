
import React from 'react';
import { ZipCodeInput as CommonZipCodeInput } from '@/components/common/ZipCodeInput';

interface ZipCodeInputProps {
  zipCode: string;
  setZipCode: (zip: string, isValid?: boolean) => void;
  isDisabled?: boolean;
}

export const ZipCodeInput: React.FC<ZipCodeInputProps> = ({
  zipCode,
  setZipCode,
  isDisabled = false
}) => {
  return (
    <CommonZipCodeInput
      value={zipCode}
      onChange={setZipCode}
      disabled={isDisabled}
      placeholder="ZIP Code (e.g. 90210)"
      className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary"
    />
  );
};
