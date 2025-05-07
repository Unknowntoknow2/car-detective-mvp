
import React from 'react';
import { motion } from 'framer-motion';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { CDButton } from '@/components/ui-kit/CDButton';
import { BodyM, BodyS, HeadingL } from '@/components/ui-kit/typography';
import { Camera, AlertCircle, Lock } from 'lucide-react';
import { AICondition } from '@/types/photo';
import styles from '../styles';
import { cn } from '@/lib/utils';

interface PhotoAnalysisProps {
  photoUrl?: string;
  photoScore?: number;
  condition?: AICondition | null;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({
  photoUrl,
  photoScore,
  condition,
  isPremium = false,
  onUpgrade
}) => {
  // Handle no photo case
  if (!photoUrl) {
    return (
      <CDCard>
        <CDCardHeader>
          <HeadingL as="h3" className="text-xl font-medium">
            Vehicle Condition
          </HeadingL>
        </CDCardHeader>
        <CDCardBody>
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <Camera className="h-16 w-16 text-gray-400 mb-4" />
            <BodyM className="text-gray-600 mb-2">No vehicle photos available</BodyM>
            <BodyS className="text-gray-500 max-w-md mx-auto">
              Upload photos of your vehicle to get an AI-powered condition assessment and more accurate valuation.
            </BodyS>
          </div>
        </CDCardBody>
      </CDCard>
    );
  }

  return (
    <CDCard>
      <CDCardHeader>
        <div className="flex justify-between items-center">
          <HeadingL as="h3" className="text-xl font-medium">
            Vehicle Condition
          </HeadingL>
          {condition && photoScore && photoScore > 75 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success-dark">
              High Quality Photo
            </span>
          )}
        </div>
      </CDCardHeader>
      
      <CDCardBody>
        <div className="space-y-4">
          {/* Vehicle Image */}
          <motion.div
            className="relative rounded-lg overflow-hidden aspect-video w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={photoUrl} 
              alt="Vehicle" 
              className="w-full h-full object-cover"
            />
            
            {/* Photo score badge if available */}
            {photoScore && (
              <div className={cn(
                "absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium",
                photoScore >= 80 ? "bg-success text-white" :
                photoScore >= 60 ? "bg-warning text-white" :
                "bg-error text-white"
              )}>
                Photo Score: {photoScore}%
              </div>
            )}
          </motion.div>
          
          {/* AI Condition Analysis */}
          {condition ? (
            <div className={cn(
              "space-y-3 p-3 rounded-lg",
              isPremium ? "relative" : "relative"
            )}>
              {/* Condition score */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <BodyS className="text-gray-500">AI Condition Assessment</BodyS>
                  <div className="flex items-center mt-1">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-sm font-medium",
                      condition.condition === 'Excellent' ? "bg-success-light text-success-dark" :
                      condition.condition === 'Good' ? "bg-primary-light text-primary" :
                      condition.condition === 'Fair' ? "bg-warning-light text-warning-dark" :
                      "bg-error-light text-error-dark"
                    )}>
                      {condition.condition}
                    </span>
                    <BodyS className="ml-2 text-gray-500">
                      Confidence: {condition.confidenceScore}%
                    </BodyS>
                  </div>
                </div>
              </div>
              
              {/* Issues detected - for premium users */}
              {isPremium && condition.issuesDetected && condition.issuesDetected.length > 0 && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <BodyS className="text-gray-500 font-medium">Issues Detected:</BodyS>
                  <ul className="list-disc list-inside space-y-1">
                    {condition.issuesDetected.map((issue, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              {/* Summary - for premium users */}
              {isPremium && condition.aiSummary && (
                <motion.div
                  className="pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <BodyS className="text-gray-500 font-medium">AI Summary:</BodyS>
                  <BodyM className="text-gray-600 mt-1">
                    {condition.aiSummary}
                  </BodyM>
                </motion.div>
              )}
              
              {/* Premium overlay for non-premium users */}
              {!isPremium && (
                <motion.div 
                  className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Lock className="h-6 w-6 text-primary mb-2" />
                  <BodyM className="text-gray-900 font-medium mb-1">
                    Detailed Condition Analysis
                  </BodyM>
                  <BodyS className="text-gray-600 mb-3 max-w-xs">
                    Unlock detailed AI condition assessment with specific issues detected and recommendations
                  </BodyS>
                  {onUpgrade && (
                    <CDButton
                      variant="primary"
                      size="sm"
                      onClick={onUpgrade}
                      icon={<Lock className="h-4 w-4" />}
                    >
                      Unlock Premium
                    </CDButton>
                  )}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-start p-3 bg-amber-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <BodyM className="text-amber-800 font-medium">
                  Condition analysis not available
                </BodyM>
                <BodyS className="text-amber-700 mt-1">
                  Our AI couldn't properly analyze this photo for condition assessment. Consider uploading a clearer photo from different angles.
                </BodyS>
              </div>
            </div>
          )}
        </div>
      </CDCardBody>
    </CDCard>
  );
};

export default PhotoAnalysis;
