
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ExternalLink, 
  Calendar, 
  Gauge 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceRecord } from '@/hooks/useServiceHistory';

interface ServiceRecordsListProps {
  records: ServiceRecord[];
}

export function ServiceRecordsList({ records }: ServiceRecordsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5">Date</TableHead>
            <TableHead className="w-1/6">Mileage</TableHead>
            <TableHead className="w-2/5">Service Details</TableHead>
            <TableHead className="w-1/5 text-right">Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary opacity-70" />
                  <span>{formatDate(record.service_date)}</span>
                </div>
              </TableCell>
              <TableCell>
                {record.mileage ? (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary opacity-70" />
                    <span>{record.mileage.toLocaleString()} mi</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not recorded</span>
                )}
              </TableCell>
              <TableCell>{record.description}</TableCell>
              <TableCell className="text-right">
                {record.receipt_url ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(record.receipt_url, '_blank')}
                    className="gap-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">No receipt</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
