import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ValuationWithCondition } from '@/types/dealer';

export type ConditionFilterOption = 'all' | 'excellent' | 'good' | 'fair' | 'poor';

interface UseDealerValuationsResult {
  valuations: ValuationWithCondition[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  conditionFilter: ConditionFilterOption;
  handlePageChange: (page: number) => void;
  handleConditionFilterChange: (condition: ConditionFilterOption) => void;
  handleDownloadReport: (valuation: ValuationWithCondition) => void;
}

export function useDealerValuations(dealerId: string): UseDealerValuationsResult {
  const [valuations, setValuations] = useState<ValuationWithCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [conditionFilter, setConditionFilter] = useState<ConditionFilterOption>('all');

  useEffect(() => {
    const fetchValuations = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('valuations')
          .select('*', { count: 'exact' });
          
        if (dealerId) {
          query = query.eq('dealer_id', dealerId);
        }
        
        if (conditionFilter !== 'all') {
          query = query.eq('condition_score', getConditionScoreRange(conditionFilter));
        }
        
        // Add pagination
        const from = (currentPage - 1) * pageSize;
        query = query.range(from, from + pageSize - 1);
        
        const { data, error, count } = await query;

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const transformedData: ValuationWithCondition[] = data.map(valuation => {
            // Extract data from JSON field if available
            const jsonData = valuation.data || {};
            
            return {
              id: valuation.id,
              make: valuation.make || '',
              model: valuation.model || '',
              year: valuation.year || 0,
              mileage: valuation.mileage || 0,
              // Use condition_score to determine condition if not explicitly set
              condition: determineConditionFromScore(valuation.condition_score),
              estimated_value: valuation.estimated_value || 0,
              confidence_score: valuation.confidence_score || 75,
              condition_score: valuation.condition_score || 70,
              created_at: valuation.created_at,
              is_vin_lookup: valuation.is_vin_lookup,
              // Extract AI condition from data JSONB if available
              aiCondition: jsonData.ai_condition || null,
              // Other fields from data
              fuel_type: jsonData.fuel_type,
              zip_code: valuation.state || '',
              body_type: valuation.body_type || jsonData.bodyType || '',
              color: valuation.color || jsonData.color || ''
            };
          });
          
          setValuations(transformedData);
          setTotalCount(count || data.length);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchValuations();
  }, [dealerId, currentPage, pageSize, conditionFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleConditionFilterChange = (condition: ConditionFilterOption) => {
    setConditionFilter(condition);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDownloadReport = (valuation: ValuationWithCondition) => {
    // Implementation for downloading report
    console.log(`Downloading report for valuation: ${valuation.id}`);
    // Add actual download implementation here
  };

  // Helper function to convert condition score to readable condition
  const determineConditionFromScore = (score?: number): string => {
    if (!score) return 'Unknown';
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  // Helper function to get condition score range for filtering
  const getConditionScoreRange = (condition: string): number => {
    switch (condition) {
      case 'excellent': return 90;
      case 'good': return 75;
      case 'fair': return 60;
      case 'poor': return 0;
      default: return 0;
    }
  };

  return { 
    valuations, 
    loading, 
    error,
    totalCount,
    currentPage,
    pageSize,
    conditionFilter,
    handlePageChange,
    handleConditionFilterChange,
    handleDownloadReport
  };
}
