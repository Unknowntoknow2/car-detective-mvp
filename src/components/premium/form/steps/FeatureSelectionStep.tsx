
import { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { featureOptions } from '@/utils/feature-calculations';
import { FeaturesGrid } from './features/FeaturesGrid';
import { FeaturesTotalValue } from './features/FeaturesTotalValue';

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

  const totalValue = formData.features.reduce((sum, id) => sum + calculateFeatureValue(id), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Premium Features</h2>
        <p className="text-gray-600 mb-6">
          Select all features present in your vehicle to ensure an accurate valuation.
        </p>
      </div>

      <FeaturesGrid
        features={featureOptions}
        selectedFeatures={formData.features}
        onToggleFeature={toggleFeature}
      />

      {formData.features.length > 0 && (
        <FeaturesTotalValue totalValue={totalValue} />
      )}
    </div>
  );
}
