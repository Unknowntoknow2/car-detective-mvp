
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@/components/common/UnifiedLoadingSystem';

interface ValuationFormActionsProps {
  onGetValuation?: () => void;
  onGetPremiumValuation?: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  showPremiumOption?: boolean;
  vehicleData?: {
    makeId?: string;
    modelId?: string;
    trimId?: string;
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
    [key: string]: any;
  };
  formComplete?: boolean;
}

export function ValuationFormActions({
  onGetValuation,
  onGetPremiumValuation,
  isLoading = false,
  isSubmitting = false,
  showPremiumOption = true,
  vehicleData,
  formComplete = false
}: ValuationFormActionsProps) {
  const navigate = useNavigate();

  const handleContinueToFollowUp = () => {
    if (!formComplete || !vehicleData?.make || !vehicleData?.model || !vehicleData?.year) {
      return;
    }

    // Create URL params with vehicle data
    const params = new URLSearchParams({
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year.toString(),
      ...(vehicleData.trim && { trim: vehicleData.trim }),
      ...(vehicleData.vin && { vin: vehicleData.vin }),
      ...(vehicleData.engine && { engine: vehicleData.engine }),
      ...(vehicleData.transmission && { transmission: vehicleData.transmission }),
      ...(vehicleData.bodyType && { bodyType: vehicleData.bodyType }),
      ...(vehicleData.fuelType && { fuelType: vehicleData.fuelType }),
      ...(vehicleData.drivetrain && { drivetrain: vehicleData.drivetrain })
    });

    navigate(`/valuation/followup?${params.toString()}`);
  };

  const handleFreeValuation = () => {
    if (formComplete && vehicleData?.make && vehicleData?.model && vehicleData?.year) {
      handleContinueToFollowUp();
    } else if (onGetValuation) {
      onGetValuation();
    }
  };

  const handlePremiumValuation = () => {
    if (formComplete && vehicleData?.make && vehicleData?.model && vehicleData?.year) {
      handleContinueToFollowUp();
    } else if (onGetPremiumValuation) {
      onGetPremiumValuation();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <LoadingButton
        onClick={handleFreeValuation}
        variant="outline"
        isLoading={isLoading && !isSubmitting}
        loadingText="Continuing..."
        className="flex-1"
        disabled={!formComplete}
      >
        Continue
      </LoadingButton>
      
      {showPremiumOption && (
        <LoadingButton
          onClick={handlePremiumValuation}
          variant="default"
          isLoading={isSubmitting}
          loadingText="Continuing..."
          className="flex-1"
          disabled={!formComplete}
        >
          Continue
        </LoadingButton>
      )}
    </div>
  );
}
