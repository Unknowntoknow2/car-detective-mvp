
import { ResourceHeader } from '@/components/ui/resource-header';
import { Plus } from 'lucide-react';

interface InventoryHeaderProps {
  onAddVehicle: () => void;
}

// Re-export with dealer inventory specific defaults
export const InventoryHeader = ({ onAddVehicle }: InventoryHeaderProps) => (
  <ResourceHeader
    title="Your Inventory"
    description="Manage your dealer inventory, add new vehicles, and track stock."
    actionLabel="Add Vehicle"
    onAction={onAddVehicle}
    icon={<Plus size={16} />}
  />
);

export default InventoryHeader;
