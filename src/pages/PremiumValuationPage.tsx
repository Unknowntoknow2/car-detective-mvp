
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumValuationForm } from '@/components/premium/form/PremiumValuationForm';

export default function PremiumValuationPage() {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved vehicle data from localStorage
    try {
      const savedData = localStorage.getItem('premium_vehicle');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setVehicleData(parsedData);
        console.log("Loaded vehicle data from localStorage:", parsedData);
      } else {
        console.log("No vehicle data found in localStorage");
        toast.error("No vehicle information found. Please start with a VIN lookup.");
        navigate('/premium', { replace: true });
      }
    } catch (error) {
      console.error("Error loading vehicle data:", error);
      toast.error("Error loading vehicle information");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/premium')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lookup
        </Button>

        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <Card>
              <CardContent className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading vehicle information...</span>
              </CardContent>
            </Card>
          ) : vehicleData ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Premium Valuation for {vehicleData.year} {vehicleData.make} {vehicleData.model}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Vehicle Information</h3>
                      <p className="mb-1"><span className="font-medium">Make:</span> {vehicleData.make}</p>
                      <p className="mb-1"><span className="font-medium">Model:</span> {vehicleData.model}</p>
                      <p className="mb-1"><span className="font-medium">Year:</span> {vehicleData.year}</p>
                      {vehicleData.trim && (
                        <p className="mb-1"><span className="font-medium">Trim:</span> {vehicleData.trim}</p>
                      )}
                      {vehicleData.vin && (
                        <p className="mb-1"><span className="font-medium">VIN:</span> {vehicleData.vin}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                      {vehicleData.bodyType && (
                        <p className="mb-1"><span className="font-medium">Body Type:</span> {vehicleData.bodyType}</p>
                      )}
                      {vehicleData.transmission && (
                        <p className="mb-1"><span className="font-medium">Transmission:</span> {vehicleData.transmission}</p>
                      )}
                      {vehicleData.drivetrain && (
                        <p className="mb-1"><span className="font-medium">Drivetrain:</span> {vehicleData.drivetrain}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PremiumValuationForm />
            </>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  No vehicle information found. Please go back and start with a VIN lookup.
                </p>
                <div className="flex justify-center mt-4">
                  <Button onClick={() => navigate('/premium')}>
                    Go to VIN Lookup
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
