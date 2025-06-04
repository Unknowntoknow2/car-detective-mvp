<<<<<<< HEAD
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { generateValuationReport, buildValuationReport } from '@/lib/valuation/buildValuationReport';
import { calculateValuation } from '@/utils/valuation/calculator';
import { ValuationParams, ValuationResult } from '@/utils/valuation/types';
import { supabase } from '@/lib/supabaseClient';
=======
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildValuationReport } from "@/lib/valuation/buildValuationReport";
import { useVehicleDBData } from "./useVehicleDBData";
import { toast } from "sonner";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface ManualVehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
<<<<<<< HEAD
=======
  condition: "excellent" | "good" | "fair" | "poor";
  fuelType?: string;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  features?: string[];
  valuation?: number;
}

<<<<<<< HEAD
export interface ManualValuationState {
  isLoading: boolean;
  data: ValuationResult | null;
  error: string | null;
  pdfUrl: string | null;
  isPdfGenerating: boolean;
}

export const useManualValuation = () => {
  const [state, setState] = useState<ManualValuationState>({
    isLoading: false,
    data: null,
    error: null,
    pdfUrl: null,
    isPdfGenerating: false
  });

  // Generate a valuation report for the given vehicle
  const generateReport = async (params: ValuationParams, isPremium: boolean = false) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
=======
export function useManualValuation() {
  const [formData, setFormData] = useState<ManualVehicleInfo>({
    makeId: "",
    modelId: "",
    year: new Date().getFullYear(),
    mileage: 0,
    zipCode: "",
    condition: "good",
  });
  const [valuation, setValuation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string>("");
  const { getMakeName, getModelName } = useVehicleDBData();

  const resetForm = () => {
    setValuation(null);
    setFormData({
      makeId: "",
      modelId: "",
      year: new Date().getFullYear(),
      mileage: 0,
      zipCode: "",
      condition: "good",
    });
    setValuationId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (
      !formData.makeId || !formData.modelId || !formData.year ||
      !formData.mileage || !formData.zipCode || !formData.condition
    ) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

    try {
      // Add isPremium to params
      const extendedParams = {
        ...params,
        isPremium,
        identifierType: 'manual' as 'vin' | 'plate' | 'manual' | 'photo'
      };

<<<<<<< HEAD
      // Calculate valuation
      const valuationResult = await calculateValuation(extendedParams);
      
      // Add required id field for compatibility with types
      const completeValuationResult = {
        ...valuationResult,
        id: crypto.randomUUID()
      };

      // Save to Supabase if user is authenticated
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Save the valuation to the valuations table
          const { error } = await supabase
            .from('valuations')
            .insert({
              user_id: user.id,
              make: params.make,
              model: params.model,
              year: params.year,
              mileage: params.mileage,
              condition: params.condition,
              state: params.zipCode,
              estimated_value: valuationResult.estimatedValue,
              confidence_score: valuationResult.confidenceScore,
              is_vin_lookup: false,
              fuel_type: params.fuelType,
              transmission: params.transmission,
              body_style: params.bodyType,
              premium_unlocked: isPremium
            });
            
          if (error) {
            console.error('Error saving valuation to Supabase:', error);
          }
        }
      } catch (saveError) {
        console.error('Error saving to Supabase:', saveError);
        // Continue with the valuation process even if saving fails
      }

      // Generate the PDF report
      const reportResult = await buildValuationReport(extendedParams, completeValuationResult, {});

      // Update state with the valuation data and PDF URL
      setState({
        isLoading: false,
        data: completeValuationResult,
        error: null,
        pdfUrl: reportResult.pdfUrl,
        isPdfGenerating: false
      });

      return {
        valuationResult: completeValuationResult,
        reportResult
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate valuation';
      
      // Set error state
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isPdfGenerating: false
      }));
      
      // Show error toast
      toast({
        title: "Valuation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  };

  // Generate premium report with additional features
  const generatePremiumReport = async (params: ValuationParams, options = {}) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Add premium flag to params
      const premiumParams = {
        ...params,
        isPremium: true,
        identifierType: 'manual' as 'vin' | 'plate' | 'manual' | 'photo'
      };

      // Calculate valuation
      const valuationResult = await calculateValuation(premiumParams);
      
      // Add required id field for compatibility with types
      const completeValuationResult = {
        ...valuationResult,
        id: crypto.randomUUID()
      };

      // Save to Supabase if user is authenticated
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Save the premium valuation to the valuations table
          const { data, error } = await supabase
            .from('valuations')
            .insert({
              user_id: user.id,
              make: params.make,
              model: params.model,
              year: params.year,
              mileage: params.mileage,
              condition: params.condition,
              state: params.zipCode,
              estimated_value: valuationResult.estimatedValue,
              confidence_score: valuationResult.confidenceScore,
              is_vin_lookup: false,
              fuel_type: params.fuelType,
              transmission: params.transmission,
              body_style: params.bodyType,
              premium_unlocked: true
            })
            .select()
            .single();
            
          if (error) {
            console.error('Error saving premium valuation to Supabase:', error);
          } else if (data) {
            // Add entry to premium_valuations table
            await supabase
              .from('premium_valuations')
              .insert({
                user_id: user.id,
                valuation_id: data.id
              });
          }
        }
      } catch (saveError) {
        console.error('Error saving premium data to Supabase:', saveError);
        // Continue with the valuation process even if saving fails
      }

      // Generate premium report with additional options
      const reportResult = await buildValuationReport(premiumParams, completeValuationResult, options);

      // Update state with the premium data
      setState({
        isLoading: false,
        data: {
          ...completeValuationResult,
          estimatedValue: reportResult.estimatedValue,
          confidenceScore: reportResult.confidenceScore
        },
        error: null,
        pdfUrl: reportResult.pdfUrl,
        isPdfGenerating: false
      });

      return {
        valuationResult: completeValuationResult,
        reportResult
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate premium valuation';
      
      // Set error state
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isPdfGenerating: false
      }));
      
      // Show error toast
      toast({
        title: "Premium valuation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
=======
      const report = await buildValuationReport({
        year: formData.year,
        make: makeName,
        model: modelName,
        mileage: formData.mileage,
        zipCode: formData.zipCode,
        condition: formData.condition,
        identifierType: "manual",
        fuelType: formData.fuelType || "gasoline",
        baseMarketValue: 25000, // Default base market value
      });

      if (report) {
        // Generate a UUID for the valuation
        const newValuationId = crypto.randomUUID();
        setValuationId(newValuationId);

        // Get the current user, handling the Promise correctly
        const userResponse = await supabase.auth.getUser();
        const userId = userResponse.data.user?.id;

        // Store the valuation in the database
        await supabase.from("valuations").insert({
          id: newValuationId,
          user_id: userId,
          year: formData.year,
          make: makeName,
          model: modelName,
          mileage: formData.mileage,
          state: formData.zipCode,
          estimated_value: report.estimatedValue,
          confidence_score: report.confidenceScore || 70,
          condition_score: formData.condition === "excellent"
            ? 90
            : formData.condition === "good"
            ? 75
            : formData.condition === "fair"
            ? 60
            : 40,
          is_vin_lookup: false,
        });

        setValuation(report);
        toast.success("Valuation generated successfully!");
      }
    } catch (err: any) {
      console.error("Error during valuation:", err);
      setError(err.message || "Failed to generate valuation.");
      toast.error(err.message || "Failed to generate valuation.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateValuation = async (
    vehicleData: Omit<ManualVehicleInfo, "makeId" | "modelId"> & {
      make: string;
      model: string;
    },
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const report = await buildValuationReport({
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        mileage: vehicleData.mileage,
        zipCode: vehicleData.zipCode,
        condition: vehicleData.condition,
        identifierType: "manual",
        fuelType: vehicleData.fuelType || "gasoline",
        baseMarketValue: 25000, // Default base market value
      });

      return report;
    } catch (err: any) {
      console.error("Error building valuation report:", err);
      setError(err.message || "Failed to build valuation report.");
      throw err;
    } finally {
      setIsLoading(false);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }
  };

  return {
<<<<<<< HEAD
    ...state,
    generateReport,
    generatePremiumReport,
=======
    formData,
    setFormData,
    valuation,
    isLoading,
    error,
    handleSubmit,
    calculateValuation,
    valuationId,
    resetForm,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
};
