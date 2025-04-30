
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureValueDisplayProps {
  selectedFeatures: string[];
}

export function FeatureValueDisplay({ selectedFeatures }: FeatureValueDisplayProps) {
  const estimatedFeatureValue = selectedFeatures.length * 250;
  
  if (selectedFeatures.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
    >
      +${estimatedFeatureValue.toLocaleString()} estimated value
    </motion.div>
  );
}
