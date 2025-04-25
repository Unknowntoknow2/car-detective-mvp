
import { FormData, FeatureOption } from '@/types/premium-valuation';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCcw } from 'lucide-react';

interface ReviewSubmitStepProps {
  step: number;
  formData: FormData;
  featureOptions: FeatureOption[];
  handleSubmit: () => void;
  handleReset: () => void;
  isFormValid: boolean;
}

export function ReviewSubmitStep({
  step,
  formData,
  featureOptions,
  handleSubmit,
  handleReset,
  isFormValid
}: ReviewSubmitStepProps) {
  // Calculate total value from selected features
  const calculateFeatureValue = () => {
    return formData.features.reduce((total, featureId) => {
      const feature = featureOptions.find(f => f.id === featureId);
      return total + (feature?.value || 0);
    }, 0);
  };

  const featureValue = calculateFeatureValue();
  
  // Format any number with commas
  const formatNumber = (num: number | null) => {
    if (num === null) return 'Not provided';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h2>
        <p className="text-gray-600 mb-6">
          Please review your vehicle information before submitting for a premium valuation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
            <div className="bg-white p-4 rounded-md border border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Make</p>
                  <p className="font-medium">{formData.make || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium">{formData.model || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{formData.year || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-medium">{formatNumber(formData.mileage)} miles</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-medium">{formData.fuelType || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-medium">{formData.conditionLabel} ({formData.condition}%)</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Features & History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md border border-gray-200 h-full">
                <h4 className="font-medium text-gray-900 mb-2">Selected Features</h4>
                {formData.features.length > 0 ? (
                  <div className="space-y-2">
                    {formData.features.map(featureId => {
                      const feature = featureOptions.find(f => f.id === featureId);
                      return feature ? (
                        <div key={featureId} className="flex justify-between">
                          <span className="text-sm">{feature.name}</span>
                          <span className="text-sm text-green-600">+${feature.value}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="pt-2 mt-2 border-t border-gray-100 font-medium flex justify-between">
                      <span>Total Feature Value</span>
                      <span className="text-green-600">+${featureValue}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No additional features selected</p>
                )}
              </div>
              
              <div className="bg-white p-4 rounded-md border border-gray-200 h-full">
                <h4 className="font-medium text-gray-900 mb-2">Accident History</h4>
                {formData.hasAccident ? (
                  <div>
                    <p className="text-sm text-amber-600 font-medium mb-1">
                      Vehicle has been in an accident
                    </p>
                    <p className="text-sm">
                      {formData.accidentDescription || 'No details provided'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-green-600">
                    No accident history reported
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-navy-50 p-5 rounded-md border border-navy-100 sticky top-4">
            <h3 className="text-lg font-medium text-navy-900 mb-4">Premium Valuation</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-navy-700 mb-1">Vehicle</p>
                <p className="font-medium">
                  {formData.year} {formData.make} {formData.model}
                </p>
              </div>
              
              <div className="pt-4 border-t border-navy-100">
                <div className="flex items-center text-green-600 mb-3">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Includes CARFAX® Report</span>
                </div>
                
                <div className="flex items-center text-green-600 mb-3">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Market Analysis Included</span>
                </div>
                
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Full History Check</span>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-navy-100 space-y-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="w-full bg-navy-600 hover:bg-navy-700 text-white"
                >
                  Get Premium Valuation
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full text-navy-600 border-navy-200"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset Form
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
