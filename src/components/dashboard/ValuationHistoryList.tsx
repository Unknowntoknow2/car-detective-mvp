
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Download, Car } from 'lucide-react';
import { downloadPdf } from '@/utils/pdf';

interface Valuation {
  id: string;
  created_at: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  plate?: string;
  state?: string;
  estimated_value?: number;
  is_premium?: boolean;
}

export default function ValuationHistoryList() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchValuations = async () => {
      try {
        // First get all saved valuations
        const { data: savedValuations, error: savedError } = await supabase
          .from('saved_valuations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (savedError) throw savedError;
        
        // Format the valuations
        const formattedValuations = savedValuations?.map(val => ({
          id: val.id,
          created_at: val.created_at,
          make: val.make,
          model: val.model,
          year: val.year,
          vin: val.vin,
          plate: val.plate,
          state: val.state,
          estimated_value: val.valuation,
          is_premium: false
        })) || [];
        
        // Now get premium valuations from orders
        const { data: premiumOrders, error: ordersError } = await supabase
          .from('orders')
          .select('*, valuations(*)')
          .eq('user_id', user.id)
          .eq('status', 'completed');
        
        if (ordersError) throw ordersError;
        
        // Add premium valuations to the list
        const premiumValuations = premiumOrders
          ?.filter(order => order.valuations)
          .map(order => ({
            id: order.valuations.id,
            created_at: order.created_at,
            make: order.valuations.make,
            model: order.valuations.model,
            year: order.valuations.year,
            vin: order.valuations.vin,
            plate: order.valuations.plate,
            state: order.valuations.state,
            estimated_value: order.valuations.estimated_value,
            is_premium: true
          })) || [];
        
        // Combine and sort by date
        const allValuations = [...formattedValuations, ...premiumValuations]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setValuations(allValuations);
      } catch (error: any) {
        console.error('Error fetching valuations:', error.message);
        toast.error('Failed to load valuation history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuations();
  }, [user]);

  const handleDownloadReport = (valuation: Valuation) => {
    const vehicleInfo = {
      make: valuation.make,
      model: valuation.model,
      year: valuation.year,
      vin: valuation.vin,
      plate: valuation.plate,
      state: valuation.state,
      isPremium: valuation.is_premium,
      estimatedValue: valuation.estimated_value || 0
    };
    
    downloadPdf(vehicleInfo);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (valuations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valuation History</CardTitle>
          <CardDescription>You haven't created any valuations yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="mb-4">Get started by creating your first vehicle valuation</p>
          <Button onClick={() => navigate('/lookup/vin')}>
            Start Valuation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation History</CardTitle>
        <CardDescription>Your recent vehicle valuations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Identifier</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {valuations.map((valuation) => (
              <TableRow key={valuation.id}>
                <TableCell>
                  {new Date(valuation.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {valuation.year} {valuation.make} {valuation.model}
                </TableCell>
                <TableCell>
                  {valuation.vin ? 
                    `VIN: ${valuation.vin.substring(0, 6)}...` : 
                    valuation.plate ? `Plate: ${valuation.plate}${valuation.state ? ` (${valuation.state})` : ''}` : 'N/A'
                  }
                </TableCell>
                <TableCell className="text-right">
                  {valuation.estimated_value ? 
                    `$${valuation.estimated_value.toLocaleString()}` : 
                    'N/A'
                  }
                </TableCell>
                <TableCell>
                  {valuation.is_premium ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Standard
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(valuation)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
