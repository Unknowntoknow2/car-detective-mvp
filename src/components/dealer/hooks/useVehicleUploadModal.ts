
import { useState } from 'react';
import { useVehicleUpload } from './useVehicleUpload';
import { DealerVehicleFormData } from '@/types/dealerVehicle';

export function useVehicleUploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { uploadVehicle, isUploading, uploadProgress, uploadError } = useVehicleUpload();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (data: DealerVehicleFormData, photos?: File[]) => {
    const result = await uploadVehicle(data, photos);
    if (result.success) {
      closeModal();
      return true;
    }
    return false;
  };

  return {
    isOpen,
    openModal,
    closeModal,
    isUploading,
    uploadProgress,
    uploadError,
    handleSubmit
  };
}
