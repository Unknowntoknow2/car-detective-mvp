
import { AICondition } from '@/types/photo';
import { ValuationResult } from '@/types/valuation';

export interface ValuationContextProps {
  valuationData: ValuationResult | null;
  isPremium: boolean;
  isLoading: boolean;
  error: Error | string | null;
  estimatedValue: number;
  onUpgrade: () => void;
  onDownloadPdf: () => Promise<void>;
  onEmailPdf: () => Promise<void>;
  isDownloading: boolean;
  isEmailSending: boolean;
}

export interface ValuationResultProps {
  valuationId?: string;
  isManualValuation?: boolean;
  manualValuationData?: any;
}

export interface HeaderProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export interface SummaryProps {
  confidenceScore: number;
  priceRange: { low: number; high: number };
  marketTrend: 'up' | 'down' | 'stable';
  recommendationText: string;
}

export interface PhotoAnalysisProps {
  photoUrl?: string;
  photoScore?: number;
  condition?: AICondition | null;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export interface BreakdownProps {
  basePrice: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  estimatedValue: number;
}

export interface ExplanationProps {
  explanation: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

export interface PDFActionsProps {
  isPremium: boolean;
  onDownloadPdf: () => Promise<void>;
  onEmailPdf?: () => Promise<void>;
  onUpgrade: () => void;
  isDownloading?: boolean;
  isEmailSending?: boolean;
}

export interface MobileLayoutProps {
  children: React.ReactNode;
  isPremium: boolean;
  isLoading: boolean;
  onUpgrade: () => void;
  onDownloadPdf: () => Promise<void>;
  estimatedValue: number;
  isDownloading?: boolean;
}
