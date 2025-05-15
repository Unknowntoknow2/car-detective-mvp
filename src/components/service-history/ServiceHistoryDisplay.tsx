
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ServiceRecordsList, { ServiceRecord } from './ServiceRecordsList';
import ServiceRecordsEmpty from './ServiceRecordsEmpty';
import { Loader2, Plus } from 'lucide-react';
import AddServiceForm from './AddServiceForm';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Define props for useServiceHistory hook
export interface UseServiceHistoryProps {
  vehicleId?: string;
}

// Define the expected return shape from useServiceHistory
interface UseServiceHistoryReturn {
  records: ServiceRecord[];
  isLoading: boolean;
  error: Error | null;
  addServiceRecord: (record: Omit<ServiceRecord, 'id' | 'created_at'>) => Promise<void>;
  deleteServiceRecord: (recordId: string) => Promise<void>;
  refreshRecords: () => Promise<void>;
}

// Mock for the hook until it's fully implemented
const useServiceHistory = (props: UseServiceHistoryProps): UseServiceHistoryReturn => {
  // This is a mock implementation that would be replaced by the actual hook
  return {
    records: [],
    isLoading: false,
    error: null,
    addServiceRecord: async () => {},
    deleteServiceRecord: async () => {},
    refreshRecords: async () => {}
  };
};

export interface ServiceHistoryDisplayProps {
  vehicleId?: string;
}

export const ServiceHistoryDisplay: React.FC<ServiceHistoryDisplayProps> = ({ vehicleId }) => {
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const { toast } = useToast();
  
  const {
    records,
    isLoading,
    error,
    addServiceRecord,
    deleteServiceRecord,
    refreshRecords
  } = useServiceHistory({ vehicleId });

  const handleAddRecord = async (data: any) => {
    try {
      setIsAddingRecord(true);
      await addServiceRecord({
        vehicleId: vehicleId || 'default',
        serviceType: data.serviceType,
        date: data.date,
        mileage: data.mileage,
        cost: data.cost,
        shop: data.shop,
        notes: data.notes
      });
      
      toast({
        description: "Service record added successfully",
      });
      
      // Close the sheet after adding
      const sheetClose = document.querySelector('[data-sheet-close]');
      if (sheetClose) {
        (sheetClose as HTMLElement).click();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to add service record",
      });
    } finally {
      setIsAddingRecord(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteServiceRecord(id);
      toast({
        description: "Service record deleted",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to delete service record",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || "Failed to load service records"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Service Records</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Service Record</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <AddServiceForm 
                onSubmit={handleAddRecord} 
                isLoading={isAddingRecord}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {records.length === 0 ? (
        <ServiceRecordsEmpty />
      ) : (
        <ServiceRecordsList 
          records={records}
          onDelete={handleDeleteRecord}
        />
      )}
    </div>
  );
};

export default ServiceHistoryDisplay;
