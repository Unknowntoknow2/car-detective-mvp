
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Download, PlusCircle } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useValuationHistory } from "@/hooks/useValuationHistory";
import { toast } from "sonner";
import { PremiumBadge } from "@/components/ui/premium-badge";
import { downloadPdf } from '@/utils/pdf';

export default function MyValuationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { valuations, isLoading, error, isEmpty } = useValuationHistory();
  
  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user && !isLoading) {
      toast.error("Please sign in to view your valuations");
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const getIdentifier = (valuation: any) => {
    if (valuation.vin) return `VIN: ${valuation.vin}`;
    if (valuation.plate) {
      return `Plate: ${valuation.plate}${valuation.state ? ` (${valuation.state})` : ''}`;
    }
    return 'No identifier';
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Valuations</h1>
        <Button onClick={() => navigate('/lookup/vin')} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Valuation
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Valuation History</CardTitle>
          <CardDescription>
            View and manage your vehicle valuation reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">
              <p>Something went wrong while loading your valuations.</p>
              <p className="text-sm mt-2">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : isEmpty ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No valuations yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any vehicle valuations yet.
              </p>
              <Button onClick={() => navigate('/lookup/vin')}>
                Get Your First Valuation
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valuations.map((valuation) => (
                  <TableRow key={valuation.id}>
                    <TableCell>{formatDate(valuation.created_at)}</TableCell>
                    <TableCell>
                      {valuation.year} {valuation.make} {valuation.model}
                    </TableCell>
                    <TableCell>{getIdentifier(valuation)}</TableCell>
                    <TableCell>
                      {formatCurrency(valuation.estimated_value || valuation.valuation)}
                    </TableCell>
                    <TableCell>
                      {valuation.premium_unlocked || valuation.is_premium ? (
                        <PremiumBadge size="sm" variant="default" />
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/premium?id=${valuation.id}`)}
                        >
                          Upgrade
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/valuation/${valuation.id}${valuation.premium_unlocked ? '/premium' : ''}`)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const vehicleInfo = {
                            vin: valuation.vin,
                            make: valuation.make,
                            model: valuation.model,
                            year: valuation.year,
                            plate: valuation.plate,
                            state: valuation.state
                          };
                          downloadPdf(vehicleInfo);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
