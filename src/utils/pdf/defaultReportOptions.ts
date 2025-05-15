
import { ReportOptions } from './types';

export const defaultReportOptions: ReportOptions = {
  title: 'Vehicle Valuation Report',
  showPriceRange: true,
  showConfidenceScore: true,
  includeBreakdown: true,
  includeHeader: true,
  includeFooter: true,
  includeMarketTrends: false,
  includeSimilarVehicles: false,
  includePageNumbers: true,
  logo: '',
  brandColor: '#0077CC',
  locale: 'en-US',
  isPremium: false,
};
