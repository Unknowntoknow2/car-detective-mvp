
import { create } from 'zustand';

interface VehicleUploadModalStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useVehicleUploadModal = create<VehicleUploadModalStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
