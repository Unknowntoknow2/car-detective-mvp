// ✅ File: src/pages/ValuationPage.tsx

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { CarFinderQaherCard } from '@/components/valuation/CarFinderQaherCard';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { decodeVin } from '@/services/vinService';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';
import { toast } from 'sonner';
import { PremiumBadge } from '@/components/premium/insights/PremiumBadge';
=======
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext"; // ✅ FIXED
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export default function ValuationPage() {
  const { vin: vinParam } = useParams<{ vin: string }>();
  const [searchParams] = useSearchParams();
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

<<<<<<< HEAD
  // Check if this is a premium valuation
  const isPremium = searchParams.get('premium') === 'true';

  // Handle potentially undefined VIN parameter with proper type handling
  const safeVin: string = vinParam ?? '';

  useEffect(() => {
    if (safeVin && safeVin.length === 17) {
      console.log('🔍 ValuationPage: Loading vehicle data for VIN:', safeVin, 'Premium:', isPremium);
      loadVehicleData(safeVin);
    } else if (vinParam) {
      // VIN is present but invalid length
      toast.error('Invalid VIN format. VIN must be 17 characters long.');
    }
  }, [safeVin, vinParam, isPremium]);

  const loadVehicleData = async (vinCode: string) => {
    setIsLoading(true);
    try {
      const result = await decodeVin(vinCode);
      
      if (result.success && result.data) {
        console.log('✅ ValuationPage: Vehicle data loaded:', result.data);
        setVehicle(result.data);
        toast.success('Vehicle details loaded successfully!');
      } else {
        console.error('❌ ValuationPage: Failed to load vehicle data:', result.error);
        toast.error('Failed to load vehicle details');
      }
    } catch (error) {
      console.error('❌ ValuationPage: Error loading vehicle data:', error);
      toast.error('Error loading vehicle details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpSubmit = async (formData: FollowUpAnswers): Promise<void> => {
    console.log('✅ ValuationPage: Follow-up submitted:', formData, 'Premium:', isPremium);
    toast.success('Valuation completed successfully!');
    // Handle final valuation here
  };
=======
  const handlePremiumClick = () => {
    if (user) {
      navigate("/premium-valuation");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Vehicle Valuation</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free Basic Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Get a quick estimate of your vehicle's value with basic information.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-center text-muted-foreground">
                  Basic valuation form will be implemented here.
                </p>
              </div>

              <Button asChild className="w-full">
                <Link to="/valuation/basic">
                  Start Free Valuation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Award className="h-5 w-5" />
              Premium Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-amber-700">
              Unlock comprehensive reports, market analysis, and dealer offers with our premium valuation.
            </p>

            <div className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>Full CARFAX® Vehicle History Report</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>Detailed market analysis with similar vehicles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>Connect with dealers for competitive offers</span>
                </li>
              </ul>

              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handlePremiumClick}
              >
                Get Premium Valuation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  const handleFollowUpSave = async (formData: FollowUpAnswers): Promise<void> => {
    console.log('📝 ValuationPage: Follow-up saved:', formData);
    // Handle saving progress here
  };

  // If no VIN parameter at all, show error message
  if (!vinParam) {
    return (
      <Container className="max-w-6xl py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Vehicle Valuation
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please enter a VIN to get started with your valuation.
          </p>
        </div>
      </Container>
    );
  }

  // If VIN is present but invalid length
  if (safeVin.length !== 17) {
    return (
      <Container className="max-w-6xl py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Invalid VIN
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            The provided VIN "{safeVin}" is not valid. VINs must be exactly 17 characters long.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl py-10">
      <div className="relative">
        {isPremium && <PremiumBadge />}
        
        <CarFinderQaherHeader />
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vehicle details...</p>
          </div>
        )}
        
        {vehicle && (
          <div className="space-y-8">
            {/* Enhanced Car Finder Qaher Card */}
            <CarFinderQaherCard vehicle={vehicle} />
            
            {/* Always show follow-up form when vehicle data is loaded */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Additional Vehicle Information</h2>
                <p className="text-gray-600 mb-6">Please provide some additional details to get a more accurate valuation.</p>
                
                <UnifiedFollowUpForm 
                  vin={safeVin}
                  initialData={{ vin: safeVin }}
                  onSubmit={handleFollowUpSubmit}
                  onSave={handleFollowUpSave}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Debug info only visible in development mode */}
        {SHOW_ALL_COMPONENTS && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 text-black p-3 rounded-lg text-xs z-50 opacity-80">
            <div className="space-y-1">
              <div>Debug Mode: ON</div>
              <div>Component: ValuationPage</div>
              <div>VIN: {safeVin || 'None'}</div>
              <div>Premium: {isPremium ? 'Yes' : 'No'}</div>
              <div>Vehicle Loaded: {vehicle ? 'Yes' : 'No'}</div>
              <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
