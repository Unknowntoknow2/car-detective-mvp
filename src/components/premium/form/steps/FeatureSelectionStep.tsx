
import { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';

interface FeatureSelectionStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function FeatureSelectionStep({
  step,
  formData,
  setFormData,
  updateValidity
}: FeatureSelectionStepProps) {
  useEffect(() => {
    // This step is always valid - features are optional
    updateValidity(step, true);
  }, [step, updateValidity]);

  const handleFeatureToggle = (featureId: string) => {
    const currentFeatures = formData.features || [];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(id => id !== featureId)
      : [...currentFeatures, featureId];
    
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Features</h2>
        <p className="text-gray-600 mb-6">
          Select the features your vehicle has to get a more accurate valuation.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Mock features for now */}
        <div className="border rounded p-3 cursor-pointer hover:bg-gray-50">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span>Leather Seats</span>
          </label>
        </div>
        <div className="border rounded p-3 cursor-pointer hover:bg-gray-50">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span>Navigation System</span>
          </label>
        </div>
        <div className="border rounded p-3 cursor-pointer hover:bg-gray-50">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span>Backup Camera</span>
          </label>
        </div>
      </div>
    </div>
  );
}
