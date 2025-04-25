
import React from 'react';
import { FormData } from '@/types/premium-valuation';
import { motion } from 'framer-motion';
import { VehicleSummary } from './review/VehicleSummary';
import { ReviewActions } from './review/ReviewActions';

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

      <VehicleSummary formData={formData} />
      
      <ReviewActions 
        isFormValid={isFormValid}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
      />
    </motion.div>
  );
}
