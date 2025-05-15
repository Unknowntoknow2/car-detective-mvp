import React, { useState } from 'react';
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
} from "@/components/ui/accordion";
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
import { useValuationPdf } from './result/useValuationPdf';
import { AICondition } from '@/types/photo';

// Define the vehicle info props type
export interface VehicleInfoProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
}

// Create the necessary section components that were missing
const ValuationSummary = ({ 
  estimatedValue, 
  priceRange, 
  isPremium, 
  onUpgrade 
}: { 
  estimatedValue?: number, 
  priceRange?: [number, number], 
  isPremium?: boolean, 
  onUpgrade?: () => void 
}) => (
  <div className="flex flex-col space-y-4">
    <h3 className="text-xl font-semibold">Estimated Value</h3>
    <div className="text-3xl font-bold">${estimatedValue?.toLocaleString() || '0'}</div>
    {priceRange && (
      <div className="text-sm text-muted-foreground">
        Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
      </div>
    )}
    {!isPremium && onUpgrade && (
      <Button onClick={onUpgrade} variant="outline" size="sm">
        Upgrade to Premium for More Details
      </Button>
    )}
  </div>
);

const ValuationDetails = ({ 
  valuationData 
}: { 
  valuationData: ValuationResult | null 
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Vehicle Details</h3>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Make</div>
        <div className="font-medium">{valuationData?.make || 'Unknown'}</div>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Model</div>
        <div className="font-medium">{valuationData?.model || 'Unknown'}</div>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Year</div>
        <div className="font-medium">{valuationData?.year || 'Unknown'}</div>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Mileage</div>
        <div className="font-medium">{valuationData?.mileage?.toLocaleString() || 'Unknown'} mi</div>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Condition</div>
        <div className="font-medium">{valuationData?.condition || 'Unknown'}</div>
      </div>
      {valuationData?.zipCode && (
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Location</div>
          <div className="font-medium">{valuationData.zipCode}</div>
        </div>
      )}
    </div>
  </div>
);

const PhotoAnalysis = ({ 
  photoUrl, 
  photoScore,
  condition,
  isPremium,
  onUpgrade
}: { 
  photoUrl?: string, 
  photoScore?: number,
  condition?: AICondition | null,
  isPremium?: boolean,
  onUpgrade?: () => void
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Photo Analysis</h3>
    {photoUrl ? (
      <div className="space-y-4">
        <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={photoUrl} 
            alt="Vehicle" 
            className="w-full h-full object-cover"
          />
          {photoScore && (
            <div className="absolute top-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-sm font-medium">
              Score: {photoScore}%
            </div>
          )}
        </div>
        {condition && (
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="font-medium mr-2">Condition:</div>
              <Badge variant={
                condition.condition === 'Excellent' ? 'default' :
                condition.condition === 'Good' ? 'secondary' :
                condition.condition === 'Fair' ? 'outline' : 'destructive'
              }>
                {condition.condition}
              </Badge>
              <div className="ml-2 text-sm text-muted-foreground">
                ({condition.confidenceScore}% confidence)
              </div>
            </div>
            {condition.issuesDetected && condition.issuesDetected.length > 0 && (
              <div>
                <div className="text-sm font-medium">Issues detected:</div>
                <ul className="text-sm text-muted-foreground">
                  {condition.issuesDetected.map((issue, i) => (
                    <li key={i} className="flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed rounded-md text-center h-48">
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No photo analysis available</p>
        {!isPremium && onUpgrade && (
          <Button 
            variant="link" 
            size="sm" 
            onClick={onUpgrade}
            className="mt-2"
          >
            Upgrade to add photos
          </Button>
        )}
      </div>
    )}
  </div>
);

const ValuationAdjustments = ({ 
  adjustments 
}: { 
  adjustments?: Array<{factor: string, impact: number, description?: string}> 
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Value Adjustments</h3>
    {adjustments && adjustments.length > 0 ? (
      <div className="space-y-2">
        {adjustments.map((adjustment, index) => (
          <div key={index} className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
            <div>
              <div className="font-medium">{adjustment.factor}</div>
              {adjustment.description && (
                <div className="text-sm text-muted-foreground">{adjustment.description}</div>
              )}
            </div>
            <div className={
              adjustment.impact > 0 ? 'text-green-600 font-medium' : 
              adjustment.impact < 0 ? 'text-red-600 font-medium' : 'text-gray-600'
            }>
              {adjustment.impact > 0 ? '+' : ''}{adjustment.impact.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">No adjustments available</p>
    )}
  </div>
);

// Define props for the main component
interface UnifiedValuationResultProps {
  valuationId: string;
  displayMode?: 'compact' | 'full';
  vehicleInfo: VehicleInfoProps;
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{factor: string, impact: number, description?: string}>;
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
}

// Main component
const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  valuationId,
  displayMode = 'full',
  vehicleInfo,
  estimatedValue,
  confidenceScore = 85,
  priceRange,
  adjustments,
  onDownloadPdf,
  onEmailReport
}) => {
  const navigate = useNavigate();
  const { isGenerating, handleDownloadPdf } = useValuationPdf({
    valuationData: {
      id: valuationId,
      make: vehicleInfo.make,
      model: vehicleInfo.model,
      year: vehicleInfo.year,
      mileage: vehicleInfo.mileage,
      condition: vehicleInfo.condition,
      zipCode: '',
      estimatedValue,
      confidenceScore,
      adjustments,
      created_at: new Date().toISOString()
    },
    conditionData: null
  });

  const handleEmailPdf = () => {
    if (onEmailReport) {
      onEmailReport();
    }
  };

  return (
    <div className="valuation-container">
      <Card className="bg-white">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-6">
            {/* Vehicle Summary Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {vehicleInfo.mileage.toLocaleString()} miles
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {vehicleInfo.condition} condition
                  </Badge>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm text-muted-foreground">Estimated Value</div>
                <div className="text-3xl font-bold">${estimatedValue.toLocaleString()}</div>
                {priceRange && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Confidence Score</span>
                </div>
                <div className="font-medium">{confidenceScore}%</div>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${confidenceScore}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Based on available vehicle data and market comparison
              </div>
            </div>
            
            {displayMode === 'full' && (
              <>
                {/* Separator */}
                <Separator />
                
                {/* Details and Adjustments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <ValuationDetails valuationData={{
                      id: valuationId,
                      make: vehicleInfo.make,
                      model: vehicleInfo.model,
                      year: vehicleInfo.year,
                      mileage: vehicleInfo.mileage,
                      condition: vehicleInfo.condition,
                      zipCode: '',
                      estimatedValue
                    }} />
                  </div>
                  <div className="space-y-6">
                    <ValuationAdjustments adjustments={adjustments} />
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
                  {onEmailReport && (
                    <Button variant="outline" onClick={handleEmailPdf}>
                      <Mail size={18} className="icon" />
                      Email PDF
                    </Button>
                  )}
                  <Button onClick={handleDownloadPdf} disabled={isGenerating}>
                    <Download size={18} className="icon" />
                    {isGenerating ? 'Generating PDF...' : 'Download PDF'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedValuationResult;
