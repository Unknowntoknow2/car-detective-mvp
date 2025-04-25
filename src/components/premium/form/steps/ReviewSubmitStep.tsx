
import { FormData, FeatureOption } from '@/types/premium-valuation';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ReviewSubmitStepProps {
  step: number;
  formData: FormData;
  featureOptions: FeatureOption[];
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
}

export function ReviewSubmitStep({
  step,
  formData,
  featureOptions,
  isFormValid,
  handleSubmit,
  handleReset
}: ReviewSubmitStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the total value added by selected features
  const featureValueTotal = formData.features.reduce((total, featureId) => {
    const feature = featureOptions.find(f => f.id === featureId);
    return total + (feature ? feature.value : 0);
  }, 0);

  // Format features for display
  const selectedFeatures = formData.features.map(featureId => {
    const feature = featureOptions.find(f => f.id === featureId);
    return feature ? feature.name : '';
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h2>
        <p className="text-gray-600 mb-6">
          Please review your vehicle information before submitting your valuation request.
        </p>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-6 space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Vehicle Information</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Make:</span>
                  <span className="font-medium">{formData.make || 'Not specified'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{formData.model || 'Not specified'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{formData.year || 'Not specified'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium">
                    {formData.mileage ? `${formData.mileage.toLocaleString()} miles` : 'Not specified'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium">{formData.fuelType || 'Not specified'}</span>
                </div>
              </div>
            </div>
            
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="font-medium text-gray-900">Additional Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium">{formData.conditionLabel}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Accident History:</span>
                  <span className="font-medium">{formData.hasAccident ? 'Yes' : 'No'}</span>
                </div>
                
                {formData.hasAccident && (
                  <div className="mt-1">
                    <span className="text-gray-600 block">Accident Details:</span>
                    <span className="font-medium text-sm">
                      {formData.accidentDescription || 'No details provided'}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">ZIP Code:</span>
                  <span className="font-medium">{formData.zipCode || 'Not specified'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <Separator />
          
          <motion.div variants={itemVariants}>
            <h3 className="font-medium text-gray-900 mb-2">Selected Features</h3>
            {selectedFeatures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No additional features selected</p>
            )}
          </motion.div>
          
          <Separator />
          
          <motion.div 
            variants={itemVariants} 
            className="flex justify-between items-center py-2"
          >
            <span className="font-medium">Features Value Added:</span>
            <span className="font-semibold text-green-600">+${featureValueTotal.toLocaleString()}</span>
          </motion.div>
        </CardContent>
      </Card>
      
      {!isFormValid && (
        <motion.div 
          variants={itemVariants}
          className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start"
        >
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-800">Complete all required information</h4>
            <p className="mt-1 text-sm text-amber-700">
              Please ensure all required vehicle information is provided for the most accurate valuation.
            </p>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 pt-2"
      >
        <Button
          onClick={handleFormSubmit}
          disabled={!isFormValid || isSubmitting}
          className="bg-navy-600 hover:bg-navy-700 text-white flex-1 transition-all duration-300 group"
        >
          {isSubmitting ? 'Processing...' : (
            <>
              Get Premium Valuation
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="text-gray-700 transition-all duration-300"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
      </motion.div>
    </motion.div>
  );
}
