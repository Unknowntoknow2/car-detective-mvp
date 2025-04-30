import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { ValuationForm } from './form/PremiumValuationForm';
import { ValuationResults } from './ValuationResults';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { EquipmentSummary } from '../valuation/equipment/EquipmentSummary';

interface PremiumValuationSectionProps {
  equipmentData?: {
    ids: number[];
    multiplier: number;
    valueAdd: number;
  };
}

export default function PremiumValuationSection({ equipmentData }: PremiumValuationSectionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [valuationResult, setValuationResult] = useState<any>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const handleSubmitValuation = async (values: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Basic validation
      if (!values.make || !values.model || !values.year) {
        throw new Error("Make, model, and year are required");
      }
      
      // Create the valuation request payload
      const valuationRequest: any = {
        make: values.make,
        model: values.model,
        year: values.year,
        mileage: values.mileage,
        condition: values.conditionLabel?.toLowerCase() || 'good',
        fuelType: values.fuelType,
        zipCode: values.zipCode,
        accident: values.hasAccident ? 'yes' : 'no',
        accidentDetails: values.accidentDescription ? {
          count: '1',
          severity: 'minor',
          area: 'front'
        } : undefined,
        includeCarfax: true,
        titleStatus: values.titleStatus
      };
      
      // Include equipment data in valuation request if available
      if (equipmentData && equipmentData.ids.length > 0) {
        valuationRequest.equipmentIds = equipmentData.ids;
      }
      
      // Store the valuation ID
      setValuationId(valuationRequest.id);
      
      // Store the valuation result
      setValuationResult(valuationRequest);
      
      toast.success("Valuation completed successfully!");
      navigate('/results');
    } catch (error: any) {
      console.error("Valuation submission error:", error);
      setSubmitError(error.message || "An error occurred while submitting the valuation.");
      toast.error(error.message || "An error occurred while submitting the valuation.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="container grid items-center justify-center gap-6 pt-6 md:pt-10 pb-8 md:pb-14">
      <SectionHeader
        title="Get Your Premium Valuation"
        description="Enter your vehicle details to get started"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Valuation Form</h3>
          </CardHeader>
          <CardContent>
            <ValuationForm 
              onSubmit={handleSubmitValuation}
              isLoading={isSubmitting}
              error={submitError}
            />
          </CardContent>
        </Card>
        
        {/* Add Equipment Summary */}
        {equipmentData && (
          <EquipmentSummary
            selectedEquipmentIds={equipmentData.ids}
            combinedMultiplier={equipmentData.multiplier}
            totalValueAdd={equipmentData.valueAdd}
          />
        )}
      </div>
      
      {valuationResult && (
        <ValuationResults
          estimatedValue={valuationResult.estimatedValue}
          confidenceScore={valuationResult.confidenceScore}
          priceRange={valuationResult.priceRange}
          vehicleInfo={{
            year: valuationResult.year,
            make: valuationResult.make,
            model: valuationResult.model,
            trim: valuationResult.trim,
            mileage: valuationResult.mileage,
            condition: valuationResult.condition
          }}
        />
      )}
    </section>
  );
}
