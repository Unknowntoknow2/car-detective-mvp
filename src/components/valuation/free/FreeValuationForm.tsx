
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedDecoder } from '@/hooks/useUnifiedDecoder';
import { Card } from '@/components/ui/card';
import ManualEntryForm from '@/components/lookup/ManualEntryForm';
import { Loader2 } from 'lucide-react';
import { useManualValuation, type ManualVehicleInfo } from '@/hooks/useManualValuation';
import { toast } from 'sonner';
import { useVinDecoder } from '@/hooks/useVinDecoder';

interface FreeValuationFormProps {
  onValuationComplete: (data: any) => void;
  onStartLoading?: () => void;
  isLoading?: boolean;
}

export function FreeValuationForm({ 
  onValuationComplete, 
  onStartLoading, 
  isLoading: externalLoading 
}: FreeValuationFormProps) {
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const { decode, isLoading: decoderLoading } = useUnifiedDecoder();
  const { lookupVin, isLoading: vinDecoderLoading } = useVinDecoder();
  const { calculateValuation, isLoading: calculationLoading } = useManualValuation();
  const [activeTab, setActiveTab] = useState('vin');
  
  const isLoading = externalLoading || decoderLoading || calculationLoading || vinDecoderLoading;

  const handleSubmit = async (e: React.FormEvent, type: 'vin' | 'plate' | 'manual') => {
    e.preventDefault();
    
    if (onStartLoading) {
      onStartLoading();
    }
    
    if (type === 'vin') {
      if (!vin || vin.length !== 17) {
        toast.error('Please enter a valid 17-character VIN');
        return;
      }
      
      try {
        // First, try the VIN decoder
        const result = await lookupVin(vin);
        
        if (result) {
          // Convert the decoded vehicle to manual vehicle info format
          const vehicleData = {
            year: result.year || new Date().getFullYear(),
            make: result.make || '',
            model: result.model || '',
            mileage: 50000, // Default mileage
            condition: 'good' as const,
            zipCode: '10001', // Default zip
            fuelType: 'gasoline',
            trim: result.trim
          };
          
          // Calculate valuation for the decoded vehicle
          const valuationResult = await calculateValuation(vehicleData);
          
          if (valuationResult) {
            onValuationComplete(valuationResult);
            return;
          }
        }
        
        // Fallback to unified decoder if VIN decoder fails
        const decodedVehicle = await decode('vin', { vin });
        
        if (decodedVehicle) {
          // Convert the decoded vehicle to manual vehicle info format
          const vehicleData = {
            year: decodedVehicle.year || new Date().getFullYear(),
            make: decodedVehicle.make || '',
            model: decodedVehicle.model || '',
            mileage: 50000, // Default mileage
            condition: 'good' as const,
            zipCode: '10001', // Default zip
            fuelType: 'gasoline',
            trim: decodedVehicle.trim
          };
          
          // Calculate valuation for the decoded vehicle
          const valuationResult = await calculateValuation(vehicleData);
          
          if (valuationResult) {
            onValuationComplete(valuationResult);
          }
        }
      } catch (error) {
        console.error('VIN lookup error:', error);
        toast.error('Error looking up VIN. Please try again or use manual entry.');
      }
    } else if (type === 'plate') {
      try {
        const params = { licensePlate: plate, state };
        const decodedVehicle = await decode('plate', params);
        
        if (decodedVehicle) {
          // Convert the decoded vehicle to manual vehicle info format
          const vehicleData = {
            year: decodedVehicle.year || new Date().getFullYear(),
            make: decodedVehicle.make || '',
            model: decodedVehicle.model || '',
            mileage: 50000, // Default mileage
            condition: 'good' as const,
            zipCode: '10001', // Default zip
            fuelType: 'gasoline',
            trim: decodedVehicle.trim
          };
          
          // Calculate valuation for the decoded vehicle
          const valuationResult = await calculateValuation(vehicleData);
          
          if (valuationResult) {
            onValuationComplete(valuationResult);
          }
        }
      } catch (error) {
        console.error('Plate lookup error:', error);
        toast.error('Error looking up license plate. Please try again or use manual entry.');
      }
    }
  };

  const handleManualSubmit = async (data: any) => {
    if (onStartLoading) {
      onStartLoading();
    }
    
    try {
      // Convert form data to the format expected by calculateValuation
      const vehicleData = {
        year: parseInt(data.year),
        make: data.make,
        model: data.model,
        mileage: parseInt(data.mileage),
        condition: data.condition || 'good' as const,
        zipCode: data.zipCode || '10001',
        fuelType: data.fuelType || 'gasoline'
      };
      
      // Calculate the valuation using the manual data
      const valuationResult = await calculateValuation(vehicleData);
      
      if (valuationResult) {
        // Store the manual entry data and send to parent
        localStorage.setItem('manual_valuation_data', JSON.stringify(data));
        onValuationComplete(valuationResult);
      }
    } catch (error) {
      console.error('Manual valuation error:', error);
      toast.error('Error processing manual entry. Please try again.');
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="vin" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="vin">VIN</TabsTrigger>
          <TabsTrigger value="plate">License Plate</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="vin" className="space-y-4">
          <form onSubmit={(e) => handleSubmit(e, 'vin')} className="space-y-4">
            <div>
              <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                Vehicle Identification Number (VIN)
              </label>
              <Input
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="Enter 17-character VIN"
                className="mt-1 font-mono"
                maxLength={17}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || vin.length !== 17}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Valuation...
                </>
              ) : (
                'Get Free Valuation'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="plate" className="space-y-4">
          <form onSubmit={(e) => handleSubmit(e, 'plate')} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="plate" className="block text-sm font-medium text-gray-700">
                  License Plate
                </label>
                <Input
                  id="plate"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="Enter license plate"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="Enter state (e.g., CA)"
                  className="mt-1"
                  maxLength={2}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !plate || !state}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Valuation...
                </>
              ) : (
                'Get Free Valuation'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <ManualEntryForm 
            onSubmit={handleManualSubmit}
            isLoading={isLoading}
            submitButtonText="Get Free Valuation"
            isPremium={false}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
