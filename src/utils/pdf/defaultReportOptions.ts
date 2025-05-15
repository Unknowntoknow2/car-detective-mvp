
import { ReportOptions } from './types';

export const defaultReportOptions: ReportOptions = {
  includeBreakdown: true,
  includeMarketTrends: false,
  includeSimilarVehicles: false,
  watermark: false,
  branding: true,
  templateId: 'default',
  isPremium: false,
  // Adding the new properties
  includeHeader: true,
  includeFooter: true,
  includePageNumbers: true,
  includePhotos: true,
  includeLegalDisclaimer: true,
  theme: 'light',
  includeBranding: true,
  includeTimestamp: true,
  includePhotoAssessment: true,
  includeAIScore: true,
  title: 'Vehicle Valuation Report'
};

export default defaultReportOptions;
