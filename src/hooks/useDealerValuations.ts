
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useUser } from './useUser';
import { ValuationWithCondition } from '@/types/dealer';

// This is a simplified structure - expand as needed
export interface ValuationWithVehicle extends ValuationWithCondition {
  // Add any additional fields here
}

export type ConditionFilterOption = 'all' | 'excellent' | 'good' | 'fair' | 'poor';

export function useDealerValuations(dealerId?: string) {
  const [valuations, setValuations] = useState<ValuationWithCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [conditionFilter, setConditionFilter] = useState<ConditionFilterOption>('all');
  const { user } = useUser();
  
  useEffect(() => {
    if (!user?.id && !dealerId) return;
    
    async function fetchDealerValuations() {
      try {
        setLoading(true);
        
        // Build the query
        let query = supabase
          .from('valuations')
          .select('*', { count: 'exact' });
        
        // Filter by dealer ID (use provided dealerId or user.id)
        const effectiveDealerId = dealerId || user?.id;
        if (effectiveDealerId) {
          query = query.eq('dealer_id', effectiveDealerId);
        }
        
        // Apply condition filter if not 'all'
        if (conditionFilter !== 'all') {
          query = query.eq('condition', conditionFilter);
        }
        
        // Add pagination
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;
        
        // Execute the query with pagination
        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range(from, to);
          
        if (error) throw error;
        
        // Update the state with the results and total count
        if (data) {
          setValuations(data as ValuationWithCondition[]);
          setTotalCount(count || 0);
        }
      } catch (err) {
        console.error('Error fetching dealer valuations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDealerValuations();
  }, [user, dealerId, currentPage, pageSize, conditionFilter]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle condition filter change
  const handleConditionFilterChange = (condition: ConditionFilterOption) => {
    setConditionFilter(condition);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handle download report
  const handleDownloadReport = (valuation: ValuationWithCondition) => {
    // Implementation for downloading report
    console.log('Downloading report for valuation:', valuation.id);
    // Here you would call your PDF generation function
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
