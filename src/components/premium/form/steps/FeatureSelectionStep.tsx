
import { Label } from '@/components/ui/label';
import { FormData, FeatureOption } from '@/types/premium-valuation';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface FeatureSelectionStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
  featureOptions: FeatureOption[];
}

export function FeatureSelectionStep({
  step,
  formData,
  setFormData,
  updateValidity,
  featureOptions
}: FeatureSelectionStepProps) {
  // This step is always valid as features are optional
  useEffect(() => {
    updateValidity(step, true);
  }, []);

  const toggleFeature = (featureId: string) => {
    setFormData(prev => {
      const features = prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId];
      
      return { ...prev, features };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Features</h2>
        <p className="text-gray-600 mb-6">
          Select all features that your vehicle has. Each feature can affect the vehicle's value.
        </p>
      </div>
      
      <div>
        <Label className="text-gray-700 mb-3 block">Additional Features</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featureOptions.map(feature => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              isSelected={formData.features.includes(feature.id)}
              onClick={() => toggleFeature(feature.id)}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Premium features can significantly increase your vehicle's value. Select all that apply.
        </p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  feature: FeatureOption;
  isSelected: boolean;
  onClick: () => void;
}

function FeatureCard({ feature, isSelected, onClick }: FeatureCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
        isSelected 
          ? 'border-navy-500 bg-navy-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isSelected ? 'bg-navy-100 text-navy-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {/* Replace with actual icon component if available */}
          <span className="text-sm">{feature.icon}</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{feature.name}</p>
          <p className="text-sm text-green-600">+${feature.value}</p>
        </div>
      </div>
      
      {isSelected && (
        <div className="h-5 w-5 text-navy-600">
          <Check className="h-5 w-5" />
        </div>
      )}
    </Card>
  );
}
