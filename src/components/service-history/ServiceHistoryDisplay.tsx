
import React from 'react';
import { useServiceHistory, ServiceRecord } from '@/hooks/useServiceHistory';
import { ServiceRecordsEmpty } from './ServiceRecordsEmpty';
import { ServiceRecordsList } from './ServiceRecordsList';
import { AddServiceForm } from './AddServiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ServiceHistoryDisplayProps {
  vin: string;
}

export const ServiceHistoryDisplay: React.FC<ServiceHistoryDisplayProps> = ({ vin }) => {
  // Updated useServiceHistory call to pass vin correctly and use refreshRecords instead of refetch
  const { records, isLoading, error, addServiceRecord, deleteServiceRecord, refreshRecords } = 
    useServiceHistory({ vin });
  
  // Function to handle record deletion with proper refreshing
  const handleDeleteRecord = async (id: string) => {
    await deleteServiceRecord(id);
    await refreshRecords();
  };
  
  // Function to handle adding a new record
  const handleAddRecord = async (record: Omit<ServiceRecord, 'id' | 'created_at'>) => {
    await addServiceRecord(record);
    await refreshRecords();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message || 'Failed to load service history'}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Service History</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        <AddServiceForm vin={vin} onSubmit={handleAddRecord} />
        
        {records.length === 0 ? (
          <ServiceRecordsEmpty />
        ) : (
          <ServiceRecordsList records={records} onDelete={handleDeleteRecord} />
        )}
      </CardContent>
    </Card>
  );
};
