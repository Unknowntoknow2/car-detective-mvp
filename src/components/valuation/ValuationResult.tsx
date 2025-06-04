<<<<<<< HEAD
=======
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { CompletionValuationHeader } from "./valuation-complete";
import { NextStepsCard } from "./valuation-complete/NextStepsCard";
import { ValuationFactorsGrid } from "./condition/factors/ValuationFactorsGrid";
import { ConditionValues } from "./condition/types";
import { toast } from "sonner";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ValuationContext } from './context/ValuationContext';
import ValuationResultLayout from './ValuationResultLayout';
import { LoadingState, ErrorState } from './index';
import { useValuationData } from './hooks/useValuationData';
import { ReportData } from '@/utils/pdf/types';
import { ValuationResultProps } from './types';

<<<<<<< HEAD
export function ValuationResult({ valuationId, isManualValuation, manualValuationData }: ValuationResultProps) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const valuationIdFromParams = id || searchParams.get('valuationId') || valuationId || '';
  const { valuationData, isLoading, error } = useValuationData(valuationIdFromParams);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (valuationData) {
      setIsPremium(valuationData.isPremium || false);
    }
  }, [valuationData]);

  const handleUpgrade = () => {
    console.log('Upgrade clicked');
    window.location.href = '/premium';
  };

  const reportData: ReportData = {
    make: valuationData?.make || 'Unknown',
    model: valuationData?.model || 'Vehicle',
    year: valuationData?.year || 2020,
    mileage: valuationData?.mileage || 0,
    condition: valuationData?.condition || 'Good',
    estimatedValue: valuationData?.estimatedValue || 0,
    confidenceScore: valuationData?.confidenceScore || 85,
    zipCode: valuationData?.zipCode || '',
    adjustments: [],
    generatedAt: new Date().toISOString(),
    vin: valuationData?.vin,
    aiCondition: {
      condition: valuationData?.condition || 'Good',
      confidenceScore: valuationData?.confidenceScore || 85,
      issuesDetected: [],
      summary: 'Vehicle condition assessment based on provided information.'
    }
  };

=======
export default function ValuationResult({
  valuationId,
  data,
  isPremium = false,
  isLoading = false,
  error,
}: ValuationResultProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const resultId = valuationId || id;

  const [conditionValues, setConditionValues] = useState<ConditionValues>({
    accidents: 0,
    mileage: 0,
    year: 0,
    titleStatus: "Clean",
  });

  useEffect(() => {
    if (data) {
      // Map valuation data to condition values if available
      setConditionValues({
        accidents: data.accidents || 0,
        mileage: data.mileage || 0,
        year: data.year || 0,
        titleStatus: data.titleStatus || "Clean",
        exteriorGrade: data.exteriorGrade || 90,
        interiorGrade: data.interiorGrade || 90,
        mechanicalGrade: data.mechanicalGrade || 90,
        tireCondition: data.tireCondition || 90,
      });
    }
  }, [data]);

  const handleConditionChange = (id: string, value: any) => {
    setConditionValues((prev) => ({
      ...prev,
      [id]: value,
    }));

    // In a real application, this would trigger a revaluation with the new condition
    toast.info("Vehicle condition updated. Recalculating valuation...");
    // This would make an API call to update the valuation
    setTimeout(() => {
      toast.success("Valuation updated based on new condition factors.");
    }, 1500);
  };

  const handleShareValuation = () => {
    // Implement share functionality
    toast.info("Share functionality would open here");
  };

  // Loading state
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  if (isLoading) {
    return <LoadingState />;
  }

<<<<<<< HEAD
  if (error) {
    return <ErrorState message={error.toString()} />;
  }

  return (
    <ValuationContext.Provider
      value={{
        valuationData,
        isPremium,
        isLoading,
        error,
        estimatedValue: valuationData?.estimatedValue || 0,
        onUpgrade: handleUpgrade,
        isDownloading: false,
        isEmailSending: false,
        onDownloadPdf: async () => { console.log('Download PDF clicked'); },
        onEmailPdf: async () => { console.log('Email PDF clicked'); }
      }}
    >
      <ValuationResultLayout />
    </ValuationContext.Provider>
=======
  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card className="p-6 bg-red-50">
          <CardContent className="p-0">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-2">
                  Error Loading Valuation
                </h2>
                <p className="text-red-600">
                  {error ||
                    "Could not load valuation data. Please try again or contact support."}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/free")}
                >
                  Start New Valuation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no data provided, render placeholder
  if (!data && !resultId) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card className="p-6">
          <CardContent className="p-0 text-center">
            <h2 className="text-xl font-bold mb-4">No Valuation Data</h2>
            <p className="text-muted-foreground mb-6">
              There is no valuation data to display. Please start a new
              valuation.
            </p>
            <Button onClick={() => navigate("/free")}>
              Start New Valuation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get values from data or use defaults
  const {
    make = "Unknown",
    model = "Unknown",
    year = new Date().getFullYear(),
    mileage = 0,
    condition = "Good",
    estimatedValue = 0,
    fuelType,
    transmission,
  } = data || {};

  // Additional info for badge display
  const additionalInfo: Record<string, string> = {};
  if (fuelType) additionalInfo.fuelType = fuelType;
  if (transmission) additionalInfo.transmission = transmission;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <CompletionValuationHeader
        vehicleInfo={{
          make,
          model,
          year,
          mileage,
          condition,
        }}
        estimatedValue={estimatedValue}
        isPremium={isPremium}
        additionalInfo={additionalInfo}
      />

      {/* Condition Factors Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Condition Factors</h2>
        <ValuationFactorsGrid
          values={conditionValues}
          onChange={handleConditionChange}
        />
      </div>

      {/* Next Steps Section */}
      {resultId && (
        <NextStepsCard
          valuationId={resultId}
          onShareClick={handleShareValuation}
          isPremium={isPremium}
        />
      )}
    </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
}

export default ValuationResult;
