
import React from 'react';
import { useSavedValuations } from '@/hooks/useSavedValuations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2, Trash2, Car, Calendar, DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const SavedValuationsList = () => {
  const { valuations, isLoading, error, deleteValuation } = useSavedValuations();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Valuations</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-gray-500">Loading your saved valuations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Valuations</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-sm text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (valuations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Valuations</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">You haven't saved any valuations yet.</p>
            <Button variant="outline">Start a New Valuation</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this saved valuation?')) {
      await deleteValuation(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Saved Valuations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Valuation</TableHead>
              <TableHead>Date Saved</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {valuations.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {item.valuationDetails.year} {item.valuationDetails.make} {item.valuationDetails.model}
                      </p>
                      {item.valuationDetails.trim && (
                        <p className="text-xs text-gray-500">{item.valuationDetails.trim}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">
                      {formatCurrency(item.valuationDetails.estimatedValue)}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {item.valuationDetails.confidenceScore}% Confidence
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(item.saved_at)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
