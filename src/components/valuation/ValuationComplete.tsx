
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PhotoUploadAndScore } from './PhotoUploadAndScore';
import { PredictionResult } from './PredictionResult';
import { ValuationAuditTrail } from './ValuationAuditTrail';
import { Download, Share, BookmarkPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';
import { ValuationAuditTrail as AuditTrailType } from "@/utils/rules/RulesEngine";
import { calculateValuation, ValuationResult } from '@/utils/valuationEngine';

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
  const [auditTrail, setAuditTrail] = useState<AuditTrailType | null>(null);
  const [estimatedValue, setEstimatedValue] = useState<number | undefined>(valuationData.estimatedValue);
  const [calculationInProgress, setCalculationInProgress] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Recalculate valuation when photo score changes
  useEffect(() => {
    if (photoScore && valuationData) {
      const calculateNewValuation = async () => {
        setCalculationInProgress(true);
        try {
          // Recalculate valuation with photo score
          const result = await calculateValuation({
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage || 0,
            condition: valuationData.condition || 'good',
            vin: valuationData.vin,
            photoScore: photoScore
          });
          
          setEstimatedValue(result.estimatedValue);
          setAuditTrail(result.auditTrail);
        } catch (error) {
          console.error("Error calculating valuation:", error);
          toast.error("Failed to update valuation with photo score");
        } finally {
          setCalculationInProgress(false);
        }
      };
      
      calculateNewValuation();
    }
  }, [photoScore, valuationData]);

  const handlePhotoScoreChange = (score: number) => {
    setPhotoScore(score);
    setPhotoSubmitted(true);
    toast.success(`Photo analyzed and scored at ${Math.round(score * 100)}%`);
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
          vin: valuationData.vin,
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
      <Card>
        <CardHeader className="bg-primary/5">
          <div className="flex justify-between items-center">
            <CardTitle>Valuation Complete</CardTitle>
            <Badge variant="outline" className="px-3">
              {valuationData.year} {valuationData.make} {valuationData.model} {valuationData.trim || ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Estimated Value</p>
                <p className="text-2xl font-semibold">
                  {estimatedValue 
                    ? formatCurrency(estimatedValue)
                    : calculationInProgress ? 'Calculating...' : 'Not available'}
                </p>
                {photoSubmitted && photoScore && (
                  <p className="text-xs text-green-600">Includes photo analysis ({Math.round(photoScore * 100)}% condition score)</p>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="text-lg">
                  {valuationData.mileage 
                    ? `${new Intl.NumberFormat('en-US').format(valuationData.mileage)} miles`
                    : 'Not specified'}
                </p>
              </div>
            </div>

            {!photoSubmitted && (
              <Alert>
                <AlertTitle>Improve your valuation accuracy</AlertTitle>
                <AlertDescription>
                  Upload a photo of your vehicle below to get a more accurate valuation based on visual condition.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t bg-gray-50 p-4">
          <Button variant="outline" onClick={shareValuation}>
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" onClick={saveToAccount} disabled={isSaving}>
            <BookmarkPlus className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </CardFooter>
      </Card>

      {auditTrail && <ValuationAuditTrail auditTrail={auditTrail} />}

      <PredictionResult valuationId={valuationId} />

      <PhotoUploadAndScore 
        valuationId={valuationId} 
        onScoreChange={handlePhotoScoreChange} 
      />

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Next Steps</h3>
          <div className="space-y-3">
            <p className="text-sm">
              For a deeper analysis including market trends, dealer offers, and a comprehensive
              vehicle history report, upgrade to our premium service.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate('/premium')}>
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
