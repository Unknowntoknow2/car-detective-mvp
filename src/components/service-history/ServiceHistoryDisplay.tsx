
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServiceRecordsEmpty from './ServiceRecordsEmpty';
import { Plus } from 'lucide-react';

export interface ServiceHistoryDisplayProps {
  vin?: string;
}

export const ServiceHistoryDisplay: React.FC<ServiceHistoryDisplayProps> = ({ vin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [isAddingRecord, setIsAddingRecord] = useState(false);

  const handleAddRecord = () => {
    setIsAddingRecord(true);
  };

  const handleCancelAdd = () => {
    setIsAddingRecord(false);
  };

  const handleSaveRecord = async (record: any) => {
    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add record to state
      setRecords([...records, { ...record, id: Date.now().toString() }]);
      setIsAddingRecord(false);
    } catch (err) {
      setError('Failed to save service record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove record from state
      setRecords(records.filter(record => record.id !== id));
    } catch (err) {
      setError('Failed to delete service record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Service History</h2>
        <Button onClick={handleAddRecord} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Service Record
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">Loading service records...</div>
      ) : error ? (
        <div className="py-8 text-center text-destructive">{error}</div>
      ) : records.length === 0 ? (
        <ServiceRecordsEmpty />
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <Card key={record.id}>
              <CardHeader className="py-3">
                <CardTitle className="text-base font-medium">
                  {record.serviceType}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Date: {record.date}</div>
                  <div>Mileage: {record.mileage}</div>
                  <div className="col-span-2">
                    Description: {record.description}
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
