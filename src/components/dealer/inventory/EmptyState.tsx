
import { EmptyState as ReusableEmptyState } from '@/components/ui/empty-state';
import { Car } from 'lucide-react';

// Re-export with dealer inventory specific defaults
export const EmptyState = ({ onAddVehicle, ...props }) => (
  <ReusableEmptyState
    title="No vehicles in your inventory"
    message="Add vehicles to your inventory to start managing your dealership stock."
    actionLabel="Add Vehicle"
    onAction={onAddVehicle}
    icon={<Car className="h-12 w-12 text-muted-foreground mb-2" />}
    {...props}
  />
);

export default EmptyState;
