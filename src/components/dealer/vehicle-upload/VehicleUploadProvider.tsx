
import React from 'react';
import { VehicleUploadModal } from './VehicleUploadModal';

interface VehicleUploadProviderProps {
  children: React.ReactNode;
}

export const VehicleUploadProvider = ({ children }: VehicleUploadProviderProps) => {
  return (
    <>
      {children}
      <VehicleUploadModal />
    </>
  );
};
