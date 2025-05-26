
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/types/premium-valuation';
import { Wrench } from 'lucide-react';

interface MaintenanceHistoryStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function MaintenanceHistoryStep({
  step,
  formData,
  setFormData,
  updateValidity
}: MaintenanceHistoryStepProps) {
  useEffect(() => {
    // Convert boolean or string to boolean for validation
    const hasRegularMaintenanceBool = typeof formData.hasRegularMaintenance === 'string'
      ? formData.hasRegularMaintenance === 'yes'
      : !!formData.hasRegularMaintenance;
      
    const isValid = hasRegularMaintenanceBool !== undefined;
    updateValidity(step, isValid);
  }, [formData.hasRegularMaintenance, formData.maintenanceNotes, step, updateValidity]);

  const handleMaintenanceChange = (value: 'yes' | 'no') => {
    setFormData(prev => ({
      ...prev,
      hasRegularMaintenance: value,
      maintenanceNotes: value === 'no' ? prev.maintenanceNotes : ''
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      maintenanceNotes: e.target.value
    }));
  };

  // Convert the hasRegularMaintenance value to string for RadioGroup
  const hasMaintenanceStr = typeof formData.hasRegularMaintenance === 'boolean'
    ? formData.hasRegularMaintenance ? 'yes' : 'no'
    : formData.hasRegularMaintenance || 'no';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Maintenance History</h2>
        <p className="text-gray-600 mb-6">
          Regular maintenance significantly impacts vehicle value and reliability.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-gray-700 mb-3 block">
            Has this vehicle received regular maintenance?
          </Label>
          <RadioGroup
            value={hasMaintenanceStr}
            onValueChange={(val) => handleMaintenanceChange(val as 'yes' | 'no')}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="maint-yes" />
              <Label htmlFor="maint-yes">Yes, regularly maintained</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="maint-no" />
              <Label htmlFor="maint-no">No, irregular maintenance</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Wrench className="h-4 w-4 text-blue-600 mt-1" />
            <Label htmlFor="maint-notes" className="text-gray-700">
              Additional maintenance notes (optional)
            </Label>
          </div>
          
          <Textarea
            id="maint-notes"
            placeholder="Recent services, repairs, or maintenance records..."
            value={formData.maintenanceNotes || ''}
            onChange={handleNotesChange}
            className="min-h-[80px]"
          />
          
          <p className="text-sm text-gray-500">
            Include information about recent oil changes, tire replacements, major repairs, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
