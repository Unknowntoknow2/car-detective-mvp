import { useState, useEffect } from 'react';
import { getListingsWithCondition, getListingsCount, ConditionFilterOption } from '@/utils/getListingsWithCondition';
import { downloadPdf } from '@/utils/pdf';
import { toast } from 'sonner';
import { ValuationWithCondition } from '@/types/dealer';
import { convertVehicleInfoToReportData } from '@/utils/pdf/dataConverter';

// Add a type definition for ValuationWithCondition that includes explanation
declare module '@/types/dealer' {
  interface ValuationWithCondition {
    explanation?: string;
    // Add other potentially missing fields
    vin?: string;
    make: string;
    model: string;
    year: number;
    mileage?: number;
    condition?: string;
    estimated_value: number;
    confidence_score: number;
    color?: string;
    body_type?: string;
    fuel_type?: string;
    zip_code?: string;
    aiCondition?: {
      condition: string;
      confidenceScore: number;
      issuesDetected?: string[];
      aiSummary?: string;
    };
  }
}

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
      
      // Convert the ValuationWithCondition to the ReportData format expected by downloadPdf
      const reportData = {
        vin: valuation.vin || 'Unknown',
        make: valuation.make,
        model: valuation.model,
        year: valuation.year,
        mileage: valuation.mileage?.toString() || '0',
        condition: valuation.aiCondition?.condition || valuation.condition || 'Not Specified',
        zipCode: valuation.zip_code || '',
        estimatedValue: valuation.estimated_value,
        confidenceScore: valuation.aiCondition?.confidenceScore || valuation.confidence_score,
        color: valuation.color || 'Unknown',
        bodyStyle: valuation.body_type || 'Unknown',
        bodyType: valuation.body_type || 'Unknown',
        fuelType: valuation.fuel_type || '',
        explanation: valuation.explanation || 'No additional information available for this vehicle.',
        isPremium: false
      };
      
      await downloadPdf(reportData);
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
