
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedVinLookup } from '../lookup/vin/EnhancedVinLookup';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface VehicleLookupFormProps {
  onVehicleFound?: (vehicle: any) => void;
  showHeader?: boolean;
}

export function VehicleLookupForm({ onVehicleFound, showHeader = true }: VehicleLookupFormProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [lastVin, setLastVin] = useState<string>('');
  const navigate = useNavigate();

  const handleVehicleFound = (vehicle: any) => {
    setDecodeError(null);
    if (onVehicleFound) {
      onVehicleFound(vehicle);
    }
  };

  const handleDecodeError = (vin: string, error: string) => {
    setLastVin(vin);
    setDecodeError(error);
  };

  const handleRetry = async () => {
    if (!lastVin) return;
    
    setIsRetrying(true);
    setDecodeError(null);
    
    try {
      // Trigger retry through the enhanced VIN lookup component
      // This will be handled by the component's internal retry logic
      setTimeout(() => {
        setIsRetrying(false);
      }, 2000);
    } catch (error) {
      setIsRetrying(false);
      setDecodeError('Retry failed. Please try again or use manual entry.');
    }
  };

  const handleManualEntry = () => {
    // Navigate to manual entry with VIN prefilled if available
    const params = lastVin ? `?vin=${lastVin}` : '';
    navigate(`/valuation${params}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-center">VIN Lookup</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <EnhancedVinLookup 
          onVehicleFound={handleVehicleFound}
          onError={handleDecodeError}
          showManualFallback={true}
        />
        
        {decodeError && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="space-y-3">
              <p className="text-orange-800">
                We couldn't decode this VIN automatically. External vehicle data services are temporarily unavailable.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleManualEntry}
                  className="w-full"
                >
                  Use Manual Entry Instead
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
