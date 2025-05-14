
import { DeleteConfirmationDialog as ReusableDeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

// Re-export the component with vehicle-specific default props
export const DeleteConfirmationDialog = (props) => (
  <ReusableDeleteConfirmationDialog
    entityName="vehicle from your inventory"
    description="This action cannot be undone."
    {...props}
  />
);
