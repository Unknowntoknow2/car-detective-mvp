
import { generateBasicReport } from './generators/basicReportGenerator';
import { generatePremiumReport } from './generators/premiumReportGenerator';
import { ReportData, PremiumReportInput } from './types';

// Export both functions with their original names
export { generateBasicReport, generatePremiumReport };

// Also export generateBasicReport as generateValuationPdf for backward compatibility
export const generateValuationPdf = generateBasicReport;
