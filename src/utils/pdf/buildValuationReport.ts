
import { ValuationResult } from '@/types/valuation';

export const buildValuationReport = (result: ValuationResult, includeCarfax: boolean = false, templateType: 'basic' | 'premium' = 'basic') => {
  // Basic implementation to fix the test issues
  return {
    title: `Vehicle Valuation Report - ${result.year} ${result.make} ${result.model}`,
    estimatedValue: result.estimatedValue || result.estimated_value || 0,
    meta: {
      includesCarfax: includeCarfax,
      template: templateType,
      generatedAt: new Date().toISOString()
    },
    sections: {
      vehicleInfo: {
        make: result.make,
        model: result.model,
        year: result.year,
        trim: result.trim,
        vin: result.vin
      },
      valuation: {
        estimatedValue: result.estimatedValue || result.estimated_value || 0,
        confidence: result.confidenceScore || result.confidence_score || 75
      }
    }
  };
};

export default buildValuationReport;
