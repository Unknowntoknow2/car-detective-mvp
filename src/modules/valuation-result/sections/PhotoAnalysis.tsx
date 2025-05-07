
import React from 'react';
import { motion } from 'framer-motion';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { BodyM, BodyS, HeadingL } from '@/components/ui-kit/typography';
import { Camera, AlertCircle } from 'lucide-react';
import { AICondition } from '@/types/photo';
import styles from '../styles';

interface PhotoAnalysisProps {
  photoUrl?: string;
  photoScore?: number;
  condition?: AICondition | null;
  isPremium?: boolean;
}

export const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({
  photoUrl,
  photoScore,
  condition,
  isPremium = false
}) => {
  // Handle no photo case
  if (!photoUrl) {
    return (
      <motion.div
        className={styles.photo.noPhoto}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Camera className="h-16 w-16 text-gray-400 mb-4" />
        <BodyM className="text-gray-600 mb-2">No vehicle photos available</BodyM>
        <BodyS className="text-gray-500">
          Upload photos to get an AI-powered condition assessment
        </BodyS>
      </motion.div>
    );
  }
  
  return (
    <CDCard>
      <CDCardHeader>
        <div className="flex justify-between items-center">
          <HeadingL as="h3" className="text-xl font-medium">
            AI Photo Analysis
          </HeadingL>
          {isPremium && (
            <span className={styles.premiumBadge}>
              Premium
            </span>
          )}
        </div>
      </CDCardHeader>
      
      <CDCardBody>
        <div className="space-y-4">
          <motion.div 
            className={styles.photo.container}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <img 
              src={photoUrl} 
              alt="Vehicle" 
              className={styles.photo.image}
            />
            
            {photoScore !== undefined && (
              <div className={styles.photo.scoreOverlay}>
                Photo Score: {Math.round(photoScore * 100)}%
              </div>
            )}
          </motion.div>
          
          {condition ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-gray-50 p-4 rounded-lg mt-4"
            >
              <BodyM className="font-medium mb-2">
                AI Assessment: {condition.condition || 'Good'} Condition
              </BodyM>
              
              {condition.aiSummary && (
                <BodyS className="text-gray-700 mb-3">
                  {condition.aiSummary}
                </BodyS>
              )}
              
              {condition.issuesDetected && condition.issuesDetected.length > 0 && (
                <div className="mt-2">
                  <BodyS className="font-medium text-gray-700 mb-1">Issues Detected:</BodyS>
                  <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                    {condition.issuesDetected.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <AlertCircle className="h-4 w-4" />
              <BodyS>
                {isPremium 
                  ? "AI condition analysis in progress..." 
                  : "Upgrade to premium for AI condition analysis"}
              </BodyS>
            </div>
          )}
        </div>
      </CDCardBody>
    </CDCard>
  );
};

export default PhotoAnalysis;
