
import React from 'react';
import { FormData, FeatureOption } from '@/types/premium-valuation';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AccuracyMeter } from '../AccuracyMeter';
import { motion } from 'framer-motion';

interface ReviewSubmitStepProps {
  step: number;
  formData: FormData;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
}

export function ReviewSubmitStep({
  step,
  formData,
  isFormValid,
  handleSubmit,
  handleReset
}: ReviewSubmitStepProps) {
  const getSummaryFields = () => [
    { label: 'Identification', value: `${formData.identifierType.toUpperCase()}: ${formData.identifier}` },
    { label: 'Vehicle', value: `${formData.make} ${formData.model} ${formData.year}` },
    { label: 'Mileage', value: formData.mileage ? `${formData.mileage.toLocaleString()} miles` : 'Not specified' },
    { label: 'Fuel Type', value: formData.fuelType || 'Not specified' },
    { label: 'Features', value: formData.features.length ? `${formData.features.length} selected` : 'None selected' },
    { label: 'Condition', value: `${formData.conditionLabel} (${formData.condition}%)` },
    { label: 'Accident History', value: formData.hasAccident ? 'Yes' : 'No' },
    formData.hasAccident && { label: 'Accident Details', value: formData.accidentDescription },
    { label: 'ZIP Code', value: formData.zipCode || 'Not specified' }
  ].filter(Boolean);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h2>
        <p className="text-gray-600 mb-6">
          Please review your vehicle information before submitting your valuation request.
        </p>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="grid gap-4">
            {getSummaryFields().map((field, index) => (
              <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">{field.label}:</span>
                <span className="text-right font-medium">{field.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="bg-navy-600 hover:bg-navy-700 text-white flex-1 transition-all duration-300"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Get Premium Valuation
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="text-gray-700 transition-all duration-300"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}
