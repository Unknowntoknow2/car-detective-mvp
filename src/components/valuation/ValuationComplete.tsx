
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PhotoUploadAndScore } from './PhotoUploadAndScore';
import { PredictionResult } from './PredictionResult';
import { Download, Share, BookmarkPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  };
}

export function ValuationComplete({ valuationId, valuationData }: ValuationCompleteProps) {
  const [photoSubmitted, setPhotoSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePhotoScoreChange = (score: number) => {
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
          valuation: valuationData.estimatedValue || 0,
          condition_score: 0, // Will be updated when photo is analyzed
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
                <p className="text-sm text-gray-500">Base Estimate</p>
                <p className="text-2xl font-semibold">
                  {valuationData.estimatedValue 
                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(valuationData.estimatedValue)
                    : 'Calculating...'}
                </p>
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
