
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';
import { VehicleLookupForm } from '@/components/valuation/VehicleLookupForm';
import { AccidentHistoryInput } from '@/components/valuation/AccidentHistoryInput';

export default function ValuationPage() {
  const { vin } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [accidents, setAccidents] = useState({
    hasAccident: false,
    count: undefined,
    severity: undefined,
  });

  useEffect(() => {
    if (vin) {
      localStorage.setItem('current_vin', vin);
    }
  }, [vin]);

  const handleVehicleFound = (foundVehicle: any) => {
    setVehicle(foundVehicle);
  };

  const handleAccidentChange = (accidentData: any) => {
    setAccidents(accidentData);
  };

  const handleContinueToFollowup = () => {
    if (vin) {
      navigate(`/vin-lookup?vin=${vin}`);
    } else {
      navigate('/vin-lookup');
    }
  };

  return (
    <Container className="max-w-6xl py-10">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Vehicle Valuation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get an accurate valuation for your vehicle with our comprehensive assessment process.
          </p>
        </div>

        {!vehicle && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 1: Find Your Vehicle</h2>
            <VehicleLookupForm 
              onVehicleFound={handleVehicleFound} 
              showHeader={true}
            />
          </div>
        )}

        {vehicle && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Step 2: Vehicle Details & History</h2>
              <VehicleFoundCard vehicle={vehicle} />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Step 3: Accident History</h3>
              <AccidentHistoryInput
                accidents={accidents}
                onAccidentChange={handleAccidentChange}
              />
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    onClick={handleContinueToFollowup}
                    className="px-8"
                  >
                    Continue to Detailed Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
}
