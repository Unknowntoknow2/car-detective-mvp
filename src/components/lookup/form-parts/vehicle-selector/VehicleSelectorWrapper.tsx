
import React from 'react';

interface VehicleSelectorWrapperProps {
  children: React.ReactNode;
}

export const VehicleSelectorWrapper: React.FC<VehicleSelectorWrapperProps> = ({
  children
}) => {
  return (
    <div className="vehicle-selector-wrapper">
      {children}
    </div>
  );
};

export default VehicleSelectorWrapper;
