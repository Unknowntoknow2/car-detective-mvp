
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { Download, Trash2 } from 'lucide-react';
import { downloadPdf } from '@/utils/pdfGenerator';

interface SavedValuation {
  id: string;
  created_at: string;
  vin?: string | null;
  plate?: string | null;
  state?: string | null;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  valuation?: number | null;
}

export default function MyValuationsPage() {
  const [valuations, setValuations] = useState<SavedValuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchValuations = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_valuations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setValuations(data || []);
      } catch (error: any) {
        toast.error('Failed to fetch valuations');
        console.error('Error:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuations();
  }, [user, navigate]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_valuations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setValuations(valuations.filter(v => v.id !== id));
      toast.success('Valuation deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete valuation');
      console.error('Error:', error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>My Saved Valuations</CardTitle>
              <CardDescription>View and manage your saved vehicle valuations</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Loading valuations...</p>
              ) : valuations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No valuations saved</p>
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
                      <TableHead className="text-right">Value</TableHead>
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
                        <TableCell>
                          {valuation.vin ? 
                            `VIN: ${valuation.vin}` : 
                            `Plate: ${valuation.plate}${valuation.state ? ` (${valuation.state})` : ''}`
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(valuation.valuation)}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
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
                              downloadPdf(vehicleInfo as any);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(valuation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      </main>
      <Footer />
    </div>
  );
}
