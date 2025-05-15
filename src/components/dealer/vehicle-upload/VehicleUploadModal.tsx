import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DealerVehicleForm } from '@/components/dealer/forms/DealerVehicleForm';
import { VinLookupForm } from '@/components/dealer/forms/VinLookupForm';
import { useToast } from '@/components/ui/use-toast';
import { useDealerVehicles } from '@/hooks/useDealerVehicles';
import { DealerVehicleFormData } from '@/types/dealerVehicle';
import { Loader2 } from 'lucide-react';

export interface VehicleUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VehicleUploadModal: React.FC<VehicleUploadModalProps> = ({
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = React.useState('manual');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [vinData, setVinData] = React.useState<Partial<DealerVehicleFormData> | null>(null);
  const { addVehicle } = useDealerVehicles();
  const { toast } = useToast();

  // Reset form state when modal is opened/closed
  React.useEffect(() => {
    if (!open) {
      setActiveTab('manual');
      setVinData(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleVinLookupSuccess = (data: Partial<DealerVehicleFormData>) => {
    setVinData(data);
    setActiveTab('manual'); // Switch to manual tab with pre-filled data
    toast({
      title: "VIN Lookup Successful",
      description: `Found ${data.year} ${data.make} ${data.model}`,
    });
  };

  const handleSubmit = async (data: DealerVehicleFormData) => {
    setIsSubmitting(true);
    try {
      await addVehicle(data);
      toast({
        title: "Vehicle Added",
        description: `Successfully added ${data.year} ${data.make} ${data.model} to inventory`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Vehicle to Inventory</DialogTitle>
          <DialogDescription>
            Add a new vehicle to your dealer inventory by entering details manually or using VIN lookup.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            {isSubmitting && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Adding vehicle to inventory...</span>
              </div>
            )}
            
            {!isSubmitting && (
              <DealerVehicleForm 
                initialData={vinData || {}}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitLabel="Add to Inventory"
                showCancel={true}
                onCancel={() => onOpenChange(false)}
              />
            )}
          </TabsContent>
          
          <TabsContent value="vin" className="space-y-4">
            <VinLookupForm 
              onSuccess={handleVinLookupSuccess}
              onCancel={() => onOpenChange(false)}
            />
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
