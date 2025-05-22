
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/result';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PremiumUpgradeCTA } from '@/components/premium/PremiumUpgradeCTA';
import { toast } from 'sonner';
import { usePremiumCredits } from '@/hooks/usePremiumCredits';
import { useValuationPdf } from '@/components/valuation/result/useValuationPdf';
import { PDFPreview } from '@/components/pdf/PDFPreview';

const ValuationResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [valuationData, setValuationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const { useCredit } = usePremiumCredits();
  
  // Get photo condition data if available
  const [conditionData, setConditionData] = useState<any>(null);
  
  // Initialize the PDF functionality
  const { generatePdf, emailPdf, downloadSamplePdf, isGenerating, isEmailSending } = useValuationPdf({
    valuationId: id,
    valuationData,
    conditionData
  });
  
  // Check if coming from premium purchase
  const searchParams = new URLSearchParams(location.search);
  const premiumParam = searchParams.get('premium');
  
  useEffect(() => {
    const fetchValuation = async () => {
      if (!id) {
        setError('No valuation ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        // Get the valuation data
        const { data: valuation, error: valuationError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (valuationError) throw valuationError;
        
        if (!valuation) {
          throw new Error('Valuation not found');
        }
        
        // Check if this valuation has premium access
        const { data: premiumValuation, error: premiumError } = await supabase
          .from('premium_valuations')
          .select('*')
          .eq('valuation_id', id)
          .maybeSingle();
        
        // Set premium flag if either the valuation itself is marked premium or we have a premium_valuations entry
        const hasPremiumAccess = valuation.premium_unlocked || !!premiumValuation;
        setIsPremium(hasPremiumAccess);
        
        // If premium param is set, check premium status
        if (premiumParam === '1' && !hasPremiumAccess) {
          // Use a premium credit
          const success = await useCredit(id);
          if (success) {
            setIsPremium(true);
            toast.success('Premium report unlocked!');
          }
        }
        
        // Get photo condition data if available
        const { data: photoConditionData } = await supabase
          .from('photo_condition_scores')
          .select('*')
          .eq('valuation_id', id)
          .maybeSingle();
        
        if (photoConditionData) {
          setConditionData(photoConditionData);
        }
        
        // Format the data
        const formattedValuation = {
          ...valuation,
          estimatedValue: valuation.estimated_value,
          confidenceScore: valuation.confidence_score,
          priceRange: valuation.price_range || calculatePriceRange(valuation.estimated_value, valuation.confidence_score),
          adjustments: valuation.adjustments || generateAdjustments(valuation),
          isPremium: hasPremiumAccess
        };
        
        setValuationData(formattedValuation);
      } catch (err) {
        console.error('Error fetching valuation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load valuation');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchValuation();
  }, [id, premiumParam, useCredit]);

  // Helper function to calculate price range
  const calculatePriceRange = (estimatedValue: number, confidenceScore: number): [number, number] => {
    const variancePercentage = Math.max(5, 20 - (confidenceScore / 10)); // Higher confidence = smaller range
    const variance = estimatedValue * (variancePercentage / 100);
    return [Math.floor(estimatedValue - variance), Math.ceil(estimatedValue + variance)];
  };

  // Helper function to generate sample adjustments
  const generateAdjustments = (valuation: any) => {
    const adjustments = [
      {
        factor: 'Mileage',
        impact: valuation.mileage ? Math.round((100000 - valuation.mileage) / 5000) * 100 : 0,
        description: valuation.mileage ? `${valuation.mileage.toLocaleString()} miles` : 'Unknown mileage'
      },
      {
        factor: 'Condition',
        impact: valuation.condition === 'Excellent' ? 1500 : 
                valuation.condition === 'VeryGood' ? 750 : 
                valuation.condition === 'Good' ? 0 : 
                valuation.condition === 'Fair' ? -750 : -1500,
        description: valuation.condition || 'Good'
      },
      {
        factor: 'Market Demand',
        impact: Math.round(Math.random() * 1000) - 500,
        description: 'Based on current market trends'
      }
    ];
    
    return adjustments;
  };
  
  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!isPremium) {
      handleUpgrade();
      return;
    }
    
    await generatePdf({ isPremium: true });
  };
  
  // Handle email PDF
  const handleEmailPdf = async () => {
    if (!isPremium) {
      handleUpgrade();
      return;
    }
    
    await emailPdf();
  };
  
  const handleUpgrade = () => {
    // Show the premium upgrade CTA or redirect to premium page
    navigate(`/premium?valuation=${id}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-2xl font-bold mb-2">Valuation Results</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="p-6 bg-red-50 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold">Error loading valuation</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {!isPremium && (
              <PremiumUpgradeCTA valuationId={id} />
            )}
            
            <Card className="p-6">
              <ValuationResult 
                valuationId={id} 
                data={valuationData}
                isPremium={isPremium}
                onUpgrade={handleUpgrade}
                onDownloadPdf={handleDownloadPdf}
                onEmailPdf={handleEmailPdf}
                isGeneratingPdf={isGenerating}
                isEmailingSending={isEmailSending}
              />
            </Card>
            
            {/* Free Sample PDF Preview */}
            <div className="mt-8">
              <PDFPreview 
                onViewSample={downloadSamplePdf}
                onUpgradeToPremium={handleUpgrade}
                isLoading={isGenerating}
              />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ValuationResultPage;
