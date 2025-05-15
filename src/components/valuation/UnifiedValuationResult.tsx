import React from 'react';
import { ValuationResult } from '@/types/valuation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertTriangle,
  CheckCircle,
  Clock4,
  CreditCard,
  FileText,
  Lock,
  Percent,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Upload,
  XCircle,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

import { PhotoAnalysis } from '@/modules/valuation-result/sections/PhotoAnalysis';
import { ValuationSummary } from '@/modules/valuation-result/sections/ValuationSummary';
import { ValuationDetails } from '@/modules/valuation-result/sections/ValuationDetails';
import { ValuationAdjustments } from '@/modules/valuation-result/sections/ValuationAdjustments';
import { useValuationPdf } from './result/useValuationPdf';
import { PremiumBadge } from '@/components/ui/premium-badge';
import { AICondition } from '@/types/photo';

interface UnifiedValuationHeaderProps {
  valuationData: ValuationResult | null;
  isLoading: boolean;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function UnifiedValuationHeader({
  valuationData,
  isLoading,
  isPremium,
  onUpgrade
}: UnifiedValuationHeaderProps) {
  const navigate = useNavigate();
  const { isGenerating, handleDownloadPdf } = useValuationPdf({
    valuationData,
    conditionData: valuationData?.aiCondition as AICondition,
    isPremium
  });

  const handleEditValuation = () => {
    if (!valuationData) return;
    navigate(`/valuation/${valuationData.id}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Title and Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Valuation Result
          </h2>
          {valuationData?.createdAt && (
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(valuationData.createdAt), {
                addSuffix: true,
              })}{' '}
              ({format(new Date(valuationData.createdAt), 'MMM d, yyyy h:mm a')})
            </p>
          )}
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleEditValuation} disabled={isLoading}>
            Edit Valuation
          </Button>
          <Button onClick={downloadPdfHandler} disabled={isLoading || isGenerating}>
            {isGenerating ? (
              <>
                Generating PDF...
              </>
            ) : (
              <>
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="bg-white">
        <CardContent className="p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Valuation Summary Section */}
              <ValuationSummary
                estimatedValue={valuationData?.estimatedValue}
                priceRange={valuationData?.priceRange}
                isPremium={isPremium}
                onUpgrade={onUpgrade}
              />

              {/* Separator */}
              <Separator />

              {/* Details and Photo Analysis Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Details */}
                <ValuationDetails valuationData={valuationData} />

                {/* Photo Analysis */}
                <PhotoAnalysis 
                  photoUrl={valuationData?.bestPhotoUrl || valuationData?.photo_url} 
                  photoScore={valuationData?.photoScore}
                  condition={valuationData?.aiCondition}
                  isPremium={isPremium}
                  onUpgrade={onUpgrade}
                />
              </div>

              {/* Separator */}
              <Separator />

              {/* Valuation Adjustments Section */}
              <ValuationAdjustments adjustments={valuationData?.adjustments} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UnifiedValuationHeader;
