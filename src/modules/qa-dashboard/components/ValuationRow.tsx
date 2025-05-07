
// We need to create this file since it was referenced in the error but doesn't exist yet
import React from 'react';
import { Valuation } from '../types';
import { CDButton } from '@/components/ui-kit/CDButton';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { AlertCircle, Download, RefreshCw, ExternalLink, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to get a color based on confidence score
const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-primary';
  if (score >= 50) return 'text-warning-dark';
  return 'text-error';
};

// Helper function to get condition label class
const getConditionLabel = (condition: string) => {
  const conditionMap: Record<string, string> = {
    'Excellent': 'bg-success-light text-success-dark',
    'Good': 'bg-primary-light text-primary',
    'Fair': 'bg-warning-light text-warning-dark',
    'Poor': 'bg-error-light text-error-dark'
  };
  
  return conditionMap[condition] || 'bg-neutral-lighter text-neutral-darker';
};

interface ValuationRowProps {
  valuation: Valuation;
  onViewResult: (id: string) => void;
  onRerunGPT: (id: string) => void;
  onGeneratePDF: (id: string) => void;
  onDownloadPDF: (id: string) => void;
  onViewStripeStatus: (id: string) => void;
}

export const ValuationRow: React.FC<ValuationRowProps> = ({
  valuation,
  onViewResult,
  onRerunGPT,
  onGeneratePDF,
  onDownloadPDF,
  onViewStripeStatus
}) => {
  const {
    id,
    created_at,
    source_type,
    condition,
    confidence_score,
    is_premium,
    estimated_value,
    vin,
    make,
    model,
    year
  } = valuation;

  return (
    <tr className="hover:bg-neutral-50">
      <td className="py-3 px-4 text-sm">{formatDate(created_at)}</td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-medium text-sm">{source_type === 'vin' ? 'VIN' : source_type === 'plate' ? 'Plate' : 'Manual'}</span>
          {vin && <span className="text-xs text-neutral-dark font-mono">{vin}</span>}
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="font-medium text-sm">
          {year} {make} {model}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          getConditionLabel(condition)
        )}>
          {condition}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={cn("font-medium", getScoreColor(confidence_score))}>
          {confidence_score}%
        </span>
      </td>
      <td className="py-3 px-4">
        {is_premium ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary">
            Premium
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-lighter text-neutral-darker">
            Free
          </span>
        )}
      </td>
      <td className="py-3 px-4 font-medium">
        {formatCurrency(estimated_value)}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <CDButton
            variant="ghost"
            size="sm"
            icon={<ExternalLink className="h-4 w-4" />}
            onClick={() => onViewResult(id)}
            ariaLabel="View full result"
          />
          <CDButton
            variant="ghost"
            size="sm"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={() => onRerunGPT(id)}
            ariaLabel="Re-run GPT"
          />
          <CDButton
            variant="ghost"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={() => onDownloadPDF(id)}
            ariaLabel="Download PDF"
          />
          {is_premium && (
            <CDButton
              variant="ghost"
              size="sm"
              icon={<CreditCard className="h-4 w-4" />}
              onClick={() => onViewStripeStatus(id)}
              ariaLabel="View payment status"
            />
          )}
        </div>
      </td>
    </tr>
  );
};

export default ValuationRow;
