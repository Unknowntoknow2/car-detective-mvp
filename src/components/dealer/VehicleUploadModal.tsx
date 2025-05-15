
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VehicleUploadForm } from './VehicleUploadForm';
import { useVehicleUploadModal } from './hooks/useVehicleUploadModal';
import { DealerVehicleFormData } from '@/types/dealerVehicle';
import { UploadProgressIndicator } from './UploadProgressIndicator';

interface VehicleUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleAdded?: () => void;
}

export const VehicleUploadModal: React.FC<VehicleUploadModalProps> = ({
  open,
  onOpenChange,
  onVehicleAdded
}) => {
  const { isUploading, uploadProgress, uploadError, handleSubmit } = useVehicleUploadModal();

  const handleFormSubmit = async (data: DealerVehicleFormData, photos?: File[]) => {
    const success = await handleSubmit(data, photos);
    if (success && onVehicleAdded) {
      onVehicleAdded();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Vehicle to Inventory</DialogTitle>
        </DialogHeader>
        
        {isUploading ? (
          <UploadProgressIndicator progress={uploadProgress} error={uploadError} />
        ) : (
          <VehicleUploadForm onSubmit={handleFormSubmit} />
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
