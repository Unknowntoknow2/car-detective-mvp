
import { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';

interface VehicleIdentificationStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function VehicleIdentificationStep({
  step,
  formData,
  setFormData,
  updateValidity
}: VehicleIdentificationStepProps) {
  useEffect(() => {
    const isValid = Boolean(formData.make && formData.model && formData.year);
    updateValidity(step, isValid);
  }, [formData.make, formData.model, formData.year, step, updateValidity]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Identification</h2>
        <p className="text-gray-600 mb-6">
          Enter your vehicle's basic information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            value={formData.year || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
            className="w-full border rounded px-3 py-2"
            placeholder="2020"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make
          </label>
          <input
            type="text"
            value={formData.make || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            placeholder="Toyota"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            value={formData.model || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
            className="w-full border rounded px-3 py-2"
            placeholder="Camry"
          />
        </div>
      </div>
    </div>
  );
}
