
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceRecordsList } from './ServiceRecordsList';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { useServiceHistory } from '@/hooks/useServiceHistory';
import { ServiceHistoryUploader } from './ServiceHistoryUploader';

interface ServiceHistoryDisplayProps {
  vin: string;
}

export function ServiceHistoryDisplay({ vin }: ServiceHistoryDisplayProps) {
  const { records, isLoading, error, refetch } = useServiceHistory(vin);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleUploadComplete = () => {
    setShowAddForm(false);
    refetch();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      {showAddForm ? (
        <ServiceHistoryUploader 
          initialVin={vin} 
          onUploadComplete={handleUploadComplete} 
        />
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Service History</CardTitle>
              {records.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {records.length} {records.length === 1 ? 'record' : 'records'}
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddForm(true)}
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Record
            </Button>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <EmptyState />
            ) : (
              <ServiceRecordsList records={records} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
