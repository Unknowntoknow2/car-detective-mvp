
import { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { ComprehensiveFeatureSelector } from '@/components/premium/features/ComprehensiveFeatureSelector';
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
    // Feature selection is always valid, even if no features are selected
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

  const handleFeaturesChange = (features: string[]) => {
    setFormData(prev => ({
      ...prev,
      features
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Premium Features</h2>
        <p className="text-gray-600 mb-6">
          Select all features present in your vehicle to ensure an accurate valuation.
          Premium features can significantly increase your vehicle's value.
        </p>
      </div>

      <ComprehensiveFeatureSelector
        selectedFeatures={formData.features}
        onFeaturesChange={handleFeaturesChange}
      />

      {formData.features.length > 0 && (
        <FeaturesTotalValue totalValue={formData.features.length * 500} />
      )}
    </div>
  );
}
