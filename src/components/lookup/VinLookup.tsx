import React from "react";

export interface VinLookupProps {
  onSubmit?: (vin: string) => void;
  // ...any other props you want
}

const VinLookup: React.FC<VinLookupProps> = ({ onSubmit }) => {
  // ...your form logic...
  // Make sure to call onSubmit when form is submitted
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const vinValue = /* get VIN value from form state */;
        if (onSubmit) onSubmit(vinValue);
      }}
    >
      {/* Your VIN input UI here */}
      <button type="submit">Lookup VIN</button>
    </form>
  );
};

export default VinLookup;
