
import React, { createContext, useContext, useState } from 'react';

export interface VehicleUploadModalContextProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openModal: () => void;
  onClose: () => void;
}

const VehicleUploadModalContext = createContext<VehicleUploadModalContextProps>({
  isOpen: false,
  setIsOpen: () => {},
  openModal: () => {},
  onClose: () => {}
});

export const VehicleUploadModalProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <VehicleUploadModalContext.Provider value={{ isOpen, setIsOpen, openModal, onClose }}>
      {children}
    </VehicleUploadModalContext.Provider>
  );
};

export const useVehicleUploadModal = () => {
  const context = useContext(VehicleUploadModalContext);
  
  if (context === undefined) {
    throw new Error('useVehicleUploadModal must be used within a VehicleUploadModalProvider');
  }
  
  return context;
};

export default useVehicleUploadModal;
