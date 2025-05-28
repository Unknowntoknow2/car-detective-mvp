
// Re-export the renamed ManualEntryFormFree as ManualEntryForm for backward compatibility
import { ManualEntryFormFree } from './ManualEntryFormFree';
import { ManualEntryFormProps } from './types/manualEntry';

export const ManualEntryForm: React.FC<ManualEntryFormProps> = (props) => {
  return <ManualEntryFormFree {...props} />;
};

export default ManualEntryForm;
