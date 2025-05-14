
import React from 'react';
import { Lock, Camera, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heading, BodyM, BodyS } from '@/components/ui-kit/typography';
import { PremiumBadge } from '@/components/ui/premium-badge';

interface PhotoAnalysisProps {
  photoUrl?: string | null;
  photoScore?: number | null;
  condition?: any | null;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const PhotoAnalysis: React.FC<PhotoAnalysisProps> = ({
  photoUrl,
  photoScore,
  condition,
  isPremium,
  onUpgrade
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-xl font-semibold mb-3">
        Photo Analysis
      </Heading>
      
      {isPremium ? (
        <div className="space-y-6">
          {photoUrl ? (
            <div>
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={photoUrl} 
                  alt="Vehicle photo" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {photoScore !== null && photoScore !== undefined && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Photo Quality Score</span>
                    <span className="font-medium">{photoScore}%</span>
                  </div>
                  <Progress value={photoScore} className="mt-1 h-2" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-200">
              <Camera className="h-12 w-12 text-gray-300 mb-2" />
              <Heading className="text-lg text-gray-400">
                No Photos Available
              </Heading>
              <BodyS className="text-gray-400 text-center max-w-xs mt-1">
                Vehicle valuation was processed without photo analysis
              </BodyS>
            </div>
          )}
          
          {condition && (
            <div className="space-y-3">
              <h4 className="font-medium">AI Condition Assessment</h4>
              <ul className="space-y-2">
                {Object.entries(condition).map(([key, value]: [string, any]) => (
                  <li key={key} className="flex items-center gap-2">
                    {value?.score > 75 ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    )}
                    <span className="capitalize">{key.replace('_', ' ')}: </span>
                    <span className="font-medium">{value?.rating || 'N/A'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center py-4 space-y-4">
          <div className="p-4 bg-slate-100 rounded-full">
            <Lock className="h-6 w-6 text-slate-500" />
          </div>
          <div>
            <p className="font-medium text-lg">Photo Analysis Locked</p>
            <p className="text-muted-foreground mb-4">
              Unlock AI-powered photo analysis with Premium
            </p>
            <Button onClick={onUpgrade}>
              Upgrade to Premium <PremiumBadge className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAnalysis;
