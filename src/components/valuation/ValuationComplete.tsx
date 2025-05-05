import { useEffect, useState } from 'react';
import { PhotoUploadAndScore } from './PhotoUploadAndScore';
import { PredictionResult } from './PredictionResult';
import { ValuationAuditTrail } from './ValuationAuditTrail';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ValuationHeader, NextStepsCard } from './valuation-complete';
import { calculateValuation } from '@/utils/valuationEngine';
import { ChatBubble } from '@/components/chat/ChatBubble';

// Add this interface to handle audit trail type
export interface AuditTrail {
  factor: string;
  impact: number;
  description: string;
}

interface ValuationCompleteProps {
  valuationId: string;
  valuationData: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    mileage?: number;
    vin?: string;
    estimatedValue?: number;
    condition?: string;
  };
}

export function ValuationComplete({ valuationId, valuationData }: ValuationCompleteProps) {
  const [photoSubmitted, setPhotoSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [aiCondition, setAiCondition] = useState<any | null>(null);
  const [auditTrail, setAuditTrail] = useState<AuditTrail[] | null>(null);
  const [estimatedValue, setEstimatedValue] = useState<number | undefined>(valuationData.estimatedValue);
  const [calculationInProgress, setCalculationInProgress] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Recalculate valuation when photo score or AI condition changes
  useEffect(() => {
    if ((photoScore || aiCondition) && valuationData) {
      const calculateNewValuation = async () => {
        setCalculationInProgress(true);
        try {
          // Recalculate valuation with photo score and AI condition
          const result = await calculateValuation({
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage || 0,
            condition: aiCondition?.condition || valuationData.condition || 'good',
            // Correctly pass the AI condition data
            aiConditionData: aiCondition ? {
              condition: aiCondition.condition,
              confidenceScore: aiCondition.confidenceScore,
              issuesDetected: aiCondition.issuesDetected,
              aiSummary: aiCondition.aiSummary
            } : null
          });
          
          setEstimatedValue(result.estimatedValue);
          
          // Convert the result adjustments to AuditTrail format if needed
          if ('adjustments' in result && Array.isArray(result.adjustments)) {
            // Type assertion to help TypeScript
            const convertedAdjustments = (result.adjustments as any[]).map(adj => ({
              factor: adj.name || adj.factor,
              impact: adj.value || adj.impact,
              description: adj.description
            }));
            setAuditTrail(convertedAdjustments as AuditTrail[]);
          } else {
            setAuditTrail(null);
          }
        } catch (error) {
          console.error("Error calculating valuation:", error);
          toast.error("Failed to update valuation with photo analysis");
        } finally {
          setCalculationInProgress(false);
        }
      };
      
      calculateNewValuation();
    }
  }, [photoScore, aiCondition, valuationData]);

  const handlePhotoScoreChange = (score: number, condition?: any) => {
    setPhotoScore(score);
    setAiCondition(condition);
    setPhotoSubmitted(true);
    toast.success(`Photos analyzed and vehicle condition assessed`);
  };

  const saveToAccount = async () => {
    if (!user) {
      toast.error("Please sign in to save this valuation");
      navigate('/auth');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('saved_valuations')
        .insert({
          user_id: user.id,
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          vin: valuationData.vin, // This is optional in the DB
          valuation: estimatedValue || 0,
          confidence_score: photoSubmitted ? 92 : 85, // Higher confidence with photo
          condition_score: photoScore ? Math.round(photoScore * 100) : null,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Valuation saved successfully");
    } catch (err) {
      console.error("Error saving valuation:", err);
      toast.error("Failed to save valuation");
    } finally {
      setIsSaving(false);
    }
  };

  const shareValuation = () => {
    if (navigator.share) {
      navigator.share({
        title: `${valuationData.year} ${valuationData.make} ${valuationData.model} Valuation`,
        text: `Check out my car valuation for a ${valuationData.year} ${valuationData.make} ${valuationData.model}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Share failed:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="space-y-8">
      <ValuationHeader
        valuationData={valuationData}
        photoSubmitted={photoSubmitted}
        photoScore={photoScore}
        aiCondition={aiCondition}
        estimatedValue={estimatedValue}
        calculationInProgress={calculationInProgress}
        onShareValuation={shareValuation}
        onSaveToAccount={saveToAccount}
        isSaving={isSaving}
      />

      {auditTrail && (
        <div className="mt-4">
          <ValuationAuditTrail 
            auditTrail={{ 
              basePrice: estimatedValue ? estimatedValue * 0.85 : 0,
              adjustments: auditTrail.map(item => ({
                name: item.factor,
                value: item.impact,
                description: item.description,
                percentAdjustment: estimatedValue ? (item.impact / (estimatedValue * 0.85)) * 100 : 0
              })),
              totalAdjustment: auditTrail.reduce((sum, item) => sum + item.impact, 0),
              estimatedValue: estimatedValue || 0,
              timestamp: new Date().toISOString(),
              inputData: {
                year: valuationData.year,
                make: valuationData.make,
                model: valuationData.model,
                mileage: valuationData.mileage || 0,
                condition: aiCondition?.condition || valuationData.condition || 'good'
              }
            }} 
          />
        </div>
      )}

      <PredictionResult valuationId={valuationId} />

      <PhotoUploadAndScore 
        valuationId={valuationId} 
        onScoreChange={handlePhotoScoreChange} 
      />

      <NextStepsCard />

      {/* Add Car Detective Chat Bubble */}
      <ChatBubble 
        valuationId={valuationId} 
        initialMessage="Tell me about my car's valuation"
      />
    </div>
  );
}
