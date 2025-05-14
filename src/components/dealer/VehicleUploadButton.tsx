
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVehicleUploadModal } from '@/components/dealer/hooks';

export const VehicleUploadButton = () => {
  const { setIsOpen } = useVehicleUploadModal();
  
  return (
    <Button 
      onClick={() => setIsOpen(true)}
      className="gap-2 bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-md"
    >
      <Plus size={16} />
      Add Vehicle
    </Button>
  );
};
