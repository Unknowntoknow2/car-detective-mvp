
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Gauge, FileText } from 'lucide-react';
import { ServiceRecord } from '@/hooks/useServiceHistory';

interface ServiceRecordsListProps {
  records: ServiceRecord[];
}

export function ServiceRecordsList({ records }: ServiceRecordsListProps) {
  const openReceipt = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
          <div className="flex flex-wrap justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{formatDate(record.service_date)}</span>
            </div>
            {record.mileage && (
              <div className="flex items-center gap-1 text-gray-600">
                <Gauge className="h-4 w-4" />
                <span>{record.mileage.toLocaleString()} miles</span>
              </div>
            )}
          </div>
          
          {record.description && (
            <p className="text-gray-700 mb-2">{record.description}</p>
          )}
          
          {record.receipt_url && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => openReceipt(record.receipt_url)}
              className="mt-1"
            >
              <FileText className="h-4 w-4 mr-1" />
              View Receipt
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
