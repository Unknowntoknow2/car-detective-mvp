
import { ReportOptions } from './types';

export const defaultReportOptions: ReportOptions = {
  includeBranding: true,
  includeExplanation: true,
  includePhotoAssessment: true,
  watermark: false,
  fontSize: 10,
  pdfQuality: 'standard',
  // Remove pageSize or add it to ReportOptions interface
};
