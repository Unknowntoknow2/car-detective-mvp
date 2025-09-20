
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { VehicleFoundCard } from '@/components/premium/lookup/plate/VehicleFoundCard';
import { UnifiedPlateLookup } from '@/components/lookup/UnifiedPlateLookup';
import { ProfessionalHero } from '@/components/ui/enhanced/ProfessionalHero';
import { ProfessionalCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/enhanced/ProfessionalCard';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { convertDecodedVehicleToVehicle } from '@/utils/vehicleConversion';
import { toast } from 'sonner';
import { Search, Camera } from 'lucide-react';

export default function PlateValuationPage() {
  const [vehicleData, setVehicleData] = useState<DecodedVehicleInfo | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleVehicleFound = (data: any) => {
    console.log('✅ Plate vehicle data:', data);
    
    // Convert plate lookup data to DecodedVehicleInfo format
    const decodedVehicle: DecodedVehicleInfo = {
      vin: data.vin || `PLATE_${data.plate}_${data.state}`,
      year: data.year,
      make: data.make,
      model: data.model,
      trim: data.trim || '',
      bodyType: data.bodyType || 'Unknown',
      fuelType: data.fuelType || 'Gasoline',
      transmission: data.transmission || 'Automatic',
      engine: data.engine || '',
      drivetrain: data.drivetrain || '',
      exteriorColor: data.exteriorColor || '',
      interiorColor: data.interiorColor || '',
      doors: data.doors || '4',
      seats: data.seats || '5',
      displacement: data.displacement || '',
      mileage: data.mileage || 0,
      condition: data.condition || 'Good',
      plate: data.plate,
      state: data.state
    };
    
    setVehicleData(decodedVehicle);
    setShowFollowUp(true);
  };

  const handleFollowUpSubmit = async (followUpAnswers: FollowUpAnswers) => {
    console.log('✅ Plate follow-up submitted:', followUpAnswers);
    toast.success('Plate valuation completed successfully!');
    // Navigate to results page
    window.location.href = `/results/${followUpAnswers.vin}`;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {!showFollowUp ? (
        <>
          {/* Professional Hero */}
          <ProfessionalHero
            badge="License Plate Lookup"
            title="Instant Vehicle"
            subtitle="Identification & Valuation"
            description="Enter any license plate to instantly decode vehicle details and get comprehensive valuation insights powered by advanced recognition technology."
            primaryAction={{
              label: 'Start Plate Lookup',
              onClick: () => {
                const element = document.getElementById('lookup-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              },
              icon: <Camera className="w-5 h-5" />,
            }}
            secondaryAction={{
              label: 'Try VIN Lookup',
              onClick: () => window.location.href = '/',
              icon: <Search className="w-5 h-5" />,
            }}
          />

          {/* Lookup Section */}
          <section id="lookup-section" className="py-20 bg-background">
            <Container className="max-w-4xl">
              <ProfessionalCard variant="elevated" className="animate-fade-in">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">License Plate Lookup</CardTitle>
                  <CardDescription className="text-lg">
                    Enter your license plate and state to get detailed vehicle information and valuation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <UnifiedPlateLookup 
                    tier="free"
                    onVehicleFound={handleVehicleFound}
                  />
                </CardContent>
              </ProfessionalCard>
            </Container>
          </section>
        </>
      ) : (
        <Container className="max-w-6xl py-10">
          <CarFinderQaherHeader />
          <div className="space-y-8">
            {vehicleData && (
              <ProfessionalCard variant="elevated" className="animate-fade-in">
                <VehicleFoundCard 
                  vehicle={vehicleData}
                  plateValue={vehicleData.plate}
                  stateValue={vehicleData.state}
                />
              </ProfessionalCard>
            )}
            
            <ProfessionalCard variant="elevated" className="animate-fade-in">
              <CardContent className="p-8">
                <UnifiedFollowUpForm 
                  vehicleData={convertDecodedVehicleToVehicle(vehicleData!)}
                  onComplete={handleFollowUpSubmit}
                  tier="free"
                />
              </CardContent>
            </ProfessionalCard>
          </div>
        </Container>
      )}
    </div>
  );
}
