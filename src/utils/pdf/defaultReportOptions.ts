
import { ReportOptions } from './types';

export const defaultReportOptions: ReportOptions = {
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
  isPremium: false,
  title: 'Vehicle Valuation Report'
};

export default defaultReportOptions;
