
import { useState, useEffect } from 'react';
import { getListingsWithCondition, getListingsCount, ValuationWithCondition, ConditionFilterOption } from '@/utils/getListingsWithCondition';
import { downloadPdf } from '@/utils/pdf';
import { toast } from 'sonner';

export function useDealerValuations() {
  const [valuations, setValuations] = useState<ValuationWithCondition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conditionFilter, setConditionFilter] = useState<ConditionFilterOption>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchValuations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [valuesData, count] = await Promise.all([
        getListingsWithCondition(conditionFilter, pageSize, currentPage),
        getListingsCount(conditionFilter)
      ]);
      
      setValuations(valuesData);
      setTotalCount(count);
    } catch (err) {
      console.error('Error fetching dealer valuations:', err);
      setError('Failed to load vehicle valuations');
      toast.error('Failed to load vehicle valuations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValuations();
  }, [conditionFilter, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleConditionFilterChange = (filter: ConditionFilterOption) => {
    setConditionFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDownloadReport = async (valuation: ValuationWithCondition) => {
    try {
      toast.success('Generating PDF report...');
      await downloadPdf(valuation);
    } catch (err) {
      console.error('Error downloading report:', err);
      toast.error('Failed to download report');
    }
  };

  return {
    valuations,
    isLoading,
    error,
    totalCount,
    currentPage,
    pageSize,
    conditionFilter,
    handlePageChange,
    handleConditionFilterChange,
    handleDownloadReport,
    refreshValuations: fetchValuations
  };
}
