
import React from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, FileText, CreditCard, Eye } from 'lucide-react';
import { CDButton } from '@/components/ui-kit/CDButton';
import { CDBadge } from '@/components/ui-kit/CDBadge';
import { CDTooltip } from '@/components/ui-kit/CDTooltip';
import { formatCurrency } from '@/utils/formatters';
import styles from '../styles';
import { useValuationPdf } from '@/components/valuation/result/useValuationPdf';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ValuationRowData {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  plate?: string;
  state?: string;
  estimated_value: number;
  condition_score?: number;
  confidence_score: number;
  premium_unlocked: boolean;
  has_gpt_explanation: boolean;
  has_photo_score: boolean;
  has_pdf_export: boolean;
}

interface ValuationRowProps {
  valuation: ValuationRowData;
  onRefresh: () => void;
}

export const ValuationRow: React.FC<ValuationRowProps> = ({ valuation, onRefresh }) => {
  const [isLoading, setIsLoading] = React.useState<{
    gpt: boolean;
    pdf: boolean;
    view: boolean;
    payment: boolean;
  }>({
    gpt: false,
    pdf: false,
    view: false,
    payment: false,
  });

  const { handleDownloadPdf, isDownloading } = useValuationPdf({
    valuationData: {
      id: valuation.id,
      make: valuation.make || '',
      model: valuation.model || '',
      year: valuation.year || 0,
      mileage: 0, // This would be updated with actual mileage if available
      condition: getConditionLabel(valuation.condition_score),
      zipCode: valuation.state || '',
      estimatedValue: valuation.estimated_value || 0,
      confidenceScore: valuation.confidence_score || 75,
    },
    conditionData: null
  });

  const getConfidenceLabel = (score?: number) => {
    if (!score) return 'low';
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };

  const getConditionLabel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSourceType = () => {
    if (valuation.vin) return 'VIN';
    if (valuation.plate) return 'Plate';
    return 'Manual';
  };
  
  const getSourceValue = () => {
    return valuation.vin || valuation.plate || 'Manual Entry';
  };

  const handleRegenerateGPT = async () => {
    try {
      setIsLoading(prev => ({ ...prev, gpt: true }));
      // Here you would implement the API call to regenerate the GPT explanation
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API call
      toast.success("GPT explanation regenerated successfully");
      onRefresh();
    } catch (error) {
      console.error('Error regenerating GPT explanation:', error);
      toast.error("Failed to regenerate GPT explanation");
    } finally {
      setIsLoading(prev => ({ ...prev, gpt: false }));
    }
  };

  const handleRegeneratePDF = async () => {
    try {
      setIsLoading(prev => ({ ...prev, pdf: true }));
      // Here you would implement the API call to regenerate the PDF
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API call
      toast.success("PDF regenerated successfully");
      onRefresh();
    } catch (error) {
      console.error('Error regenerating PDF:', error);
      toast.error("Failed to regenerate PDF");
    } finally {
      setIsLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  const handleViewStripeStatus = async () => {
    try {
      setIsLoading(prev => ({ ...prev, payment: true }));
      // Here you would implement the API call to check Stripe status
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('valuation_id', valuation.id)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        toast.success(`Payment status: ${data[0].status}`);
      } else {
        toast.info("No payment record found");
      }
    } catch (error) {
      console.error('Error checking Stripe status:', error);
      toast.error("Failed to check payment status");
    } finally {
      setIsLoading(prev => ({ ...prev, payment: false }));
    }
  };

  const handleViewValuation = () => {
    window.open(`/valuation-result/${valuation.id}`, '_blank');
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b transition-colors hover:bg-neutral-lighter/30"
    >
      <td className="py-3 px-4">{formatDate(valuation.created_at)}</td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-medium">{getSourceValue()}</span>
          <span className="text-xs text-neutral-dark">{getSourceType()}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span>{valuation.year} {valuation.make} {valuation.model}</span>
          <span className="text-xs text-neutral-dark">{getConditionLabel(valuation.condition_score)}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <CDBadge 
          variant={
            getConfidenceLabel(valuation.confidence_score) === 'high' ? 'success' : 
            getConfidenceLabel(valuation.confidence_score) === 'medium' ? 'warning' : 'error'
          }
          size="sm"
        >
          {valuation.confidence_score}%
        </CDBadge>
      </td>
      <td className="py-3 px-4">
        <CDBadge 
          variant={valuation.premium_unlocked ? 'primary' : 'neutral'}
          size="sm"
        >
          {valuation.premium_unlocked ? 'Premium' : 'Free'}
        </CDBadge>
      </td>
      <td className="py-3 px-4 font-medium text-primary">
        {formatCurrency(valuation.estimated_value)}
      </td>
      <td className="py-3 px-4">
        <div className={styles.actions.container}>
          <CDTooltip content="View full valuation result">
            <CDButton 
              variant="ghost" 
              size="sm" 
              className={styles.actions.button}
              icon={<Eye className="h-4 w-4" />}
              onClick={handleViewValuation}
            >
              View
            </CDButton>
          </CDTooltip>
          
          <CDTooltip content="Regenerate GPT explanation">
            <CDButton 
              variant="ghost" 
              size="sm" 
              className={styles.actions.button}
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={handleRegenerateGPT}
              isLoading={isLoading.gpt}
            >
              Re-run GPT
            </CDButton>
          </CDTooltip>
          
          <CDTooltip content="Regenerate PDF report">
            <CDButton 
              variant="ghost" 
              size="sm" 
              className={styles.actions.button}
              icon={<FileText className="h-4 w-4" />}
              onClick={handleRegeneratePDF}
              isLoading={isLoading.pdf}
            >
              Re-gen PDF
            </CDButton>
          </CDTooltip>
          
          <CDTooltip content="Download PDF report">
            <CDButton 
              variant="ghost" 
              size="sm" 
              className={styles.actions.button}
              icon={<Download className="h-4 w-4" />}
              onClick={handleDownloadPdf}
              isLoading={isDownloading}
              isDisabled={!valuation.premium_unlocked}
            >
              PDF
            </CDButton>
          </CDTooltip>
          
          <CDTooltip content="View Stripe payment status">
            <CDButton 
              variant="ghost" 
              size="sm" 
              className={styles.actions.button}
              icon={<CreditCard className="h-4 w-4" />}
              onClick={handleViewStripeStatus}
              isLoading={isLoading.payment}
            >
              Payment
            </CDButton>
          </CDTooltip>
        </div>
      </td>
    </motion.tr>
  );
};

export default ValuationRow;
