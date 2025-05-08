
import { ReportOptions } from './types';

export const defaultReportOptions: ReportOptions = {
  format: 'letter',
  orientation: 'portrait',
  margin: 50,
  includeBranding: true,
  includeFooter: true,
  includeTimestamp: true,
  includePhotoAssessment: false,
  includeAIScore: false,
  isPremium: false,
  title: 'Vehicle Valuation Report',
  printBackground: true, // Ensure this property is properly defined in the ReportOptions interface
  landscape: false, // Ensure this property is properly defined in the ReportOptions interface
  showWholesaleValue: false // Ensure this property is properly defined in the ReportOptions interface
};
