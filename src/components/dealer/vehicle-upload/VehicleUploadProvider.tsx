
import React, { useState } from 'react';
import { VehicleUploadModal } from './VehicleUploadModal';

interface VehicleUploadProviderProps {
  children: React.ReactNode;
}

export const VehicleUploadProvider = ({ children }: VehicleUploadProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {children}
      <VehicleUploadModal 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  );
};
