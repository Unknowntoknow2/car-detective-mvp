
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVehicleUploadModal } from '@/components/dealer/hooks/useVehicleUploadModal';

export const VehicleUploadButton = () => {
  const { openModal } = useVehicleUploadModal();
  
  return (
    <Button 
      onClick={() => openModal()}
      className="gap-2 bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-md"
    >
      <Plus size={16} />
      Add Vehicle
    </Button>
  );
};
