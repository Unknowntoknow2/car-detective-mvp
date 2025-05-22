
import React, { useState, useEffect } from 'react';
import { ValuationHistory } from '@/components/dashboard/ValuationHistory';
import { supabase } from '@/integrations/supabase/client';
import { ValuationResult } from '@/types/valuation';
import { downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { Container } from '@/components/ui/container';
import { AdjustmentItem } from '@/utils/pdf/types';

export default function UserDashboard() {
  const [userValuations, setUserValuations] = useState<ValuationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the user session safely
  const session = supabase.auth.getSession ? 
    (supabase.auth.getSession() as any)?.data?.session : 
    null;
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchUserValuations();
    } else {
      setIsLoading(false);
      setError('User not authenticated');
    }
  }, [userId]);

  const fetchUserValuations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to meet ValuationResult interface requirements
      const transformedData = data.map(item => ({
        id: item.id,
        make: item.make || '',
        model: item.model || '',
        year: item.year || 0,
        mileage: item.mileage || 0,
        vin: item.vin || '',
        estimatedValue: item.estimated_value || 0,
        photoUrl: item.photo_url || '',
        photoScore: item.photo_score || 0,
        createdAt: item.created_at || '',
        // Add missing required properties
        priceRange: [
          Math.round((item.estimated_value || 0) * 0.95), 
          Math.round((item.estimated_value || 0) * 1.05)
        ],
        adjustments: [],
        condition: item.condition || 'Unknown',
        confidenceScore: item.confidence_score || 0,
        zipCode: item.zip_code || ''
      }));

      setUserValuations(transformedData);
    } catch (err: any) {
      console.error('Error fetching valuations:', err);
      setError(err.message || 'Failed to fetch valuations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async (valuation: ValuationResult) => {
    try {
      // Prepare report data with non-null values for required fields
      // Transform adjustments to ensure description is always defined
      const formattedAdjustments: AdjustmentItem[] = (valuation.adjustments || []).map(adj => ({
        factor: adj.factor,
        impact: adj.impact,
        description: adj.description || `Adjustment for ${adj.factor}`
      }));

      const reportData = {
        make: valuation.make || 'Unknown',
        model: valuation.model || 'Unknown',
        year: valuation.year || new Date().getFullYear(),
        mileage: valuation.mileage || 0,
        estimatedValue: valuation.estimatedValue,
        confidenceScore: valuation.confidenceScore || 75,
        zipCode: valuation.zipCode || '00000',
        aiCondition: {
          condition: valuation.condition || 'Good',
          confidenceScore: valuation.confidenceScore || 75,
          issuesDetected: [],
          summary: `Vehicle is in ${valuation.condition || 'Good'} condition.`
        },
        adjustments: formattedAdjustments,
        generatedDate: new Date()
      };

      await downloadValuationPdf(reportData);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        <ValuationHistory 
          valuations={userValuations} 
          isLoading={isLoading} 
          error={error} 
          onDownloadPdf={handleDownloadPdf}
        />
      </div>
    </Container>
  );
}
