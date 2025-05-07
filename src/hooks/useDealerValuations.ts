import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReportData } from '@/utils/pdf/types';
import { ValuationWithCondition } from '@/types/dealer';

interface Valuation {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimated_value: number;
  data: any; // JSONB data
}

interface UseDealerValuationsResult {
  valuations: ValuationWithCondition[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  conditionFilter: string;
  handlePageChange: (page: number) => void;
  handleConditionFilterChange: (condition: string) => void;
  handleDownloadReport: (valuationId: string) => void;
}

export function useDealerValuations(dealerId: string): UseDealerValuationsResult {
  const [valuations, setValuations] = useState<ValuationWithCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [conditionFilter, setConditionFilter] = useState('all');

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
          query = query.eq('condition', conditionFilter);
        }
        
        // Add pagination
        const from = (currentPage - 1) * pageSize;
        query = query.range(from, from + pageSize - 1);
        
        const { data, error, count } = await query;

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const transformedData: ValuationWithCondition[] = data.map(valuation => ({
            id: valuation.id,
            make: valuation.make,
            model: valuation.model,
            year: valuation.year,
            mileage: valuation.mileage,
            condition: valuation.condition,
            estimated_value: valuation.estimated_value,
            confidence_score: valuation.confidence_score || 75,
            condition_score: valuation.condition_score || 70,
            created_at: valuation.created_at,
            is_vin_lookup: valuation.is_vin_lookup,
            // Extract AI condition from data JSONB if available
            aiCondition: valuation.data?.ai_condition || null,
            // Other fields from data
            fuel_type: valuation.data?.fuel_type,
            zip_code: valuation.data?.zipCode || valuation.state,
            body_type: valuation.data?.bodyType || valuation.body_type,
            color: valuation.data?.color || valuation.color
          }));
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

  const handleConditionFilterChange = (condition: string) => {
    setConditionFilter(condition);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDownloadReport = (valuationId: string) => {
    // Implementation for downloading report
    console.log(`Downloading report for valuation: ${valuationId}`);
    // Add actual download implementation here
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
