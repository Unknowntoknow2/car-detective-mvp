
import { ReportData } from './types';

export const testReportData: ReportData = {
  make: 'Toyota',
  model: 'Camry',
  year: 2019,
  mileage: 50000,
  estimatedValue: 15000,
  condition: 'Good',
  confidenceScore: 85,
  zipCode: '90210',
  aiCondition: {
    condition: 'Good',
    confidenceScore: 85,
    issuesDetected: [],
    summary: 'Vehicle is in good condition.'
  },
  generatedAt: new Date().toISOString(),
  adjustments: [
    {
      factor: 'Mileage',
      impact: 500,
      description: 'Lower than average mileage'
    },
    {
      factor: 'Condition',
      impact: 200,
      description: 'Good overall condition'
    }
  ]
};
