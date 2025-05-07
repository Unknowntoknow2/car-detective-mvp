
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Eye, Database, FileText, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { CDButton } from '@/components/ui-kit/CDButton';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

// Define this function earlier
const getConditionLabel = (condition: string | undefined) => {
  if (!condition) return 'Unknown';
  return condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
};

export interface ValuationRowProps {
  valuation: Valuation;
  onViewResult: (id: string) => void;
  onRerunGPT: (id: string) => void;
  onGeneratePDF: (id: string) => void;
  onDownloadPDF: (id: string) => void;
  onViewStripeStatus: (id: string) => void;
}

export interface Valuation {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zip_code: string;
  estimated_value: number;
  confidence_score: number;
  status: 'pending' | 'completed' | 'error';
  error_message?: string;
  is_premium: boolean;
  paid_at?: string;
  stripe_session_id?: string;
}

export function ValuationRow({
  valuation,
  onViewResult,
  onRerunGPT,
  onGeneratePDF,
  onDownloadPDF,
  onViewStripeStatus
}: ValuationRowProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    // Here you would typically call an API to delete the valuation
    // For now, let's just close the dialog
    setShowDeleteDialog(false);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        {format(new Date(valuation.created_at), 'MMM dd, yyyy HH:mm')}
      </td>
      <td className="py-3 px-4">{valuation.vin}</td>
      <td className="py-3 px-4">
        {valuation.year} {valuation.make} {valuation.model}
      </td>
      <td className="py-3 px-4">{valuation.mileage}</td>
      <td className="py-3 px-4">{getConditionLabel(valuation.condition)}</td>
      <td className="py-3 px-4">{valuation.zip_code}</td>
      <td className="py-3 px-4">{valuation.estimated_value}</td>
      <td className="py-3 px-4">
        {valuation.status === 'completed' ? (
          <Badge variant="outline">Completed</Badge>
        ) : valuation.status === 'pending' ? (
          <Badge>Pending</Badge>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="destructive">Error</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{valuation.error_message || 'Unknown error'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </td>

      <td className="py-3 px-4 text-right">
        <div className="flex justify-end items-center space-x-2">
          <CDButton
            variant="ghost"
            size="sm"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => onViewResult(valuation.id)}
            ariaLabel="View valuation"
          >
            View
          </CDButton>
          
          <CDButton
            variant="ghost"
            size="sm"
            icon={<Database className="h-4 w-4" />}
            onClick={() => onRerunGPT(valuation.id)}
            ariaLabel="Rerun GPT"
          >
            Rerun
          </CDButton>
          
          <CDButton
            variant="ghost"
            size="sm"
            icon={<FileText className="h-4 w-4" />}
            onClick={() => onGeneratePDF(valuation.id)}
            ariaLabel="Generate PDF"
          >
            PDF
          </CDButton>
          
          {valuation.is_premium && valuation.paid_at && (
            <CDButton
              variant="ghost"
              size="sm"
              icon={<CreditCard className="h-4 w-4" />}
              onClick={() => onViewStripeStatus(valuation.id)}
              ariaLabel="View Payment"
            >
              Payment
            </CDButton>
          )}
        </div>
      </td>
    </tr>
  );
}
