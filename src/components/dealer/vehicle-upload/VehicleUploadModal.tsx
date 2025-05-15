
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DealerVehicleForm, DealerVehicleFormData } from '@/components/dealer/forms/DealerVehicleForm';
import { Loader2 } from 'lucide-react';

interface VehicleUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleAdded?: () => void;
}

export const VehicleUploadModal: React.FC<VehicleUploadModalProps> = ({
  open,
  onOpenChange,
  onVehicleAdded
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'vin'>('manual');
  const [vinNumber, setVinNumber] = useState('');
  const [vinVehicle, setVinVehicle] = useState<any>(null);
  const [isLoadingVin, setIsLoadingVin] = useState(false);

  const handleLookupVin = async () => {
    if (!vinNumber || vinNumber.length !== 17) {
      toast("Invalid VIN - Please enter a valid 17-character VIN");
      return;
    }

    setIsLoadingVin(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockVehicle = {
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        vin: vinNumber,
        trimLevel: 'XLE',
        color: 'Silver',
        fuelType: 'Gasoline',
        transmission: 'Automatic'
      };
      
      setVinVehicle(mockVehicle);
      toast("VIN Found - Found: " + mockVehicle.year + " " + mockVehicle.make + " " + mockVehicle.model);
    } catch (error) {
      toast("Lookup Failed - Failed to look up VIN. Please try again.");
    } finally {
      setIsLoadingVin(false);
    }
  };

  const handleManualSubmit = async (data: DealerVehicleFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast("Success - Vehicle added successfully!");
      
      onOpenChange(false);
      if (onVehicleAdded) {
        onVehicleAdded();
      }
    } catch (error) {
      toast("Error - Failed to add vehicle. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Vehicle to Inventory</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'manual' | 'vin')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="pt-4">
            <DealerVehicleForm 
              onSuccess={handleManualSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Add Vehicle"
              showCancel={true}
              onCancel={handleCancel}
            />
          </TabsContent>
          
          <TabsContent value="vin" className="pt-4">
            {!vinVehicle ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="vin" className="text-sm font-medium">
                    Vehicle Identification Number (VIN)
                  </label>
                  <input
                    id="vin"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter 17-character VIN"
                    maxLength={17}
                  />
                </div>
                <Button 
                  onClick={handleLookupVin} 
                  disabled={isLoadingVin}
                  className="w-full"
                >
                  {isLoadingVin ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Looking up VIN...
                    </>
                  ) : (
                    'Lookup VIN'
                  )}
                </Button>
              </div>
            ) : (
              <DealerVehicleForm
                onSuccess={handleManualSubmit}
                initialData={{
                  make: vinVehicle.make,
                  model: vinVehicle.model,
                  year: vinVehicle.year,
                  condition: 'Good',
                  status: 'Available',
                  color: vinVehicle.color,
                  vehicleId: vinVehicle.vin,
                  photos: []
                }}
                isSubmitting={isSubmitting}
                submitLabel="Add Vehicle"
                showCancel={true}
                onCancel={handleCancel}
              />
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          {!((activeTab === 'manual' || (activeTab === 'vin' && vinVehicle))) && (
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleUploadModal;
