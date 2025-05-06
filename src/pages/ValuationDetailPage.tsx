
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import ValuationResult from '@/components/valuation/ValuationResult';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';

export default function ValuationDetailPage() {
  const { valuationId } = useParams<{ valuationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [valuationData, setValuationData] = useState<any>(null);
  const { hasPremiumAccess, isLoading: isPremiumLoading } = usePremiumAccess(valuationId);
  
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to view this valuation");
      navigate('/auth');
      return;
    }
    
    if (!valuationId) {
      toast.error("No valuation ID provided");
      navigate('/my-valuations');
      return;
    }
    
    const fetchValuationData = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          toast.error("Valuation not found or you don't have access to it");
          navigate('/my-valuations');
          return;
        }
        
        setValuationData(data);
      } catch (error: any) {
        console.error('Error fetching valuation:', error);
        toast.error("Failed to load valuation");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchValuationData();
  }, [valuationId, user, navigate]);
  
  // Redirect to premium if user has premium access
  useEffect(() => {
    if (!isPremiumLoading && hasPremiumAccess) {
      navigate(`/valuation/${valuationId}/premium`);
    }
  }, [hasPremiumAccess, isPremiumLoading, valuationId, navigate]);
  
  const handleUpgradeToPremium = () => {
    navigate(`/premium?id=${valuationId}`);
  };
  
  const handleBackToList = () => {
    navigate('/my-valuations');
  };
  
  if (isLoading || isPremiumLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handleBackToList}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Valuations
        </Button>
        
        <Button 
          onClick={handleUpgradeToPremium}
          className="flex items-center gap-2"
        >
          <Lock className="h-4 w-4" />
          Upgrade to Premium
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Valuation Report</CardTitle>
        </CardHeader>
        <CardContent>
          {valuationData && (
            <ValuationResult 
              valuationId={valuationId}
              make={valuationData.make}
              model={valuationData.model}
              year={valuationData.year}
              mileage={valuationData.mileage}
              condition={valuationData.condition}
              location={valuationData.state}
              valuation={valuationData.estimated_value}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
