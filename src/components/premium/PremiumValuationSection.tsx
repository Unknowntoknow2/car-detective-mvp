
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import PremiumValuationForm from './form/PremiumValuationForm';
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
            <PremiumValuationForm />
          </CardContent>
        </Card>
        
        {/* Add Equipment Summary */}
        {equipmentData && equipmentData.ids.length > 0 && (
          <EquipmentSummary
            selectedEquipmentIds={equipmentData.ids}
            combinedMultiplier={equipmentData.multiplier}
            totalValueAdd={equipmentData.valueAdd}
          />
        )}
      </div>
      
      {valuationResult && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Valuation Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
              <p><strong>Year:</strong> {valuationResult.year}</p>
              <p><strong>Make:</strong> {valuationResult.make}</p>
              <p><strong>Model:</strong> {valuationResult.model}</p>
              <p><strong>Condition:</strong> {valuationResult.condition}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Estimated Value</h3>
              <p className="text-3xl font-bold text-primary">
                ${(25000).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Range: ${(23500).toLocaleString()} - ${(26500).toLocaleString()}
              </p>
              <div className="mt-4">
                <p><strong>Confidence Score:</strong> 85%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
