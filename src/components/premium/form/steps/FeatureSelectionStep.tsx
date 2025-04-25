
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormData } from '@/types/premium-valuation';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { featureOptions } from '@/utils/feature-calculations';
import { Plus } from 'lucide-react';

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
  // Features are optional, so this step is always valid
  useEffect(() => {
    updateValidity(step, true);
  }, [step, updateValidity]);

  const toggleFeature = (featureId: string) => {
    setFormData(prev => {
      const features = prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId];
      return { ...prev, features };
    });
  };

  const calculateFeatureValue = (featureId: string): number => {
    const feature = featureOptions.find(f => f.id === featureId);
    return feature?.value || 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Premium Features</h2>
        <p className="text-gray-600 mb-6">
          Select all features present in your vehicle to ensure an accurate valuation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featureOptions.map(feature => (
          <Card
            key={feature.id}
            className={`p-4 cursor-pointer transition-all ${
              formData.features.includes(feature.id)
                ? 'border-primary bg-primary/5'
                : 'hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => toggleFeature(feature.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Checkbox
                  checked={formData.features.includes(feature.id)}
                  onCheckedChange={() => toggleFeature(feature.id)}
                  className="pointer-events-none"
                />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">{feature.name}</p>
                <p className="text-sm text-green-600">+${feature.value.toLocaleString()}</p>
              </div>
              {formData.features.includes(feature.id) && (
                <Plus className="h-4 w-4 text-primary transform rotate-45" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {formData.features.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Selected Features Value:</span>
            <span className="font-semibold text-green-600">
              +${formData.features.reduce((sum, id) => sum + calculateFeatureValue(id), 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
