
import { useState } from 'react';
import { useVehicleUpload } from './useVehicleUpload';
import { DealerVehicleFormData } from '@/types/dealerVehicle';

export function useVehicleUploadModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { uploadVehicle, isUploading, uploadProgress, uploadError } = useVehicleUpload();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
    isModalOpen,
    openModal,
    closeModal,
    isUploading,
    uploadProgress,
    uploadError,
    handleSubmit
  };
}
