
import { ReportOptions } from '@/types/valuation';

export const defaultReportOptions: ReportOptions = {
  includePageNumbers: true,
  includePhotos: true,
  includeSimilarVehicles: true,
  isPremium: false,
  companyInfo: {
    name: 'Car Detective',
    logo: null,
    website: 'https://cardetective.ai',
    phone: '1-800-CAR-DETECTIVE'
  }
};
