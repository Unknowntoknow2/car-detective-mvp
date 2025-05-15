
import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Export the ServiceRecord interface
export interface ServiceRecord {
  id: string;
  vehicleId: string;
  serviceType: string;
  date: string;
  mileage: number;
  cost: number;
  shop?: string;
  notes?: string;
  created_at: string;
}

export interface ServiceRecordsListProps {
  records: ServiceRecord[];
  onDelete: (id: string) => Promise<void>;
}

export const ServiceRecordsList: React.FC<ServiceRecordsListProps> = ({ records, onDelete }) => {
  if (!records.length) {
    return null;
  }

  // Sort records by date (newest first)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedRecords.map(record => (
        <Card key={record.id} className="overflow-hidden">
          <CardHeader className="bg-muted/30 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{record.serviceType}</h3>
                <Badge variant="outline" className="ml-2">
                  {formatDate(record.date)}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive" 
                onClick={() => onDelete(record.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p>{record.mileage.toLocaleString()} miles</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cost</p>
                <p>{formatCurrency(record.cost)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shop</p>
                <p>{record.shop || 'Not specified'}</p>
              </div>
            </div>
            
            {record.notes && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm mt-1">{record.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceRecordsList;
