
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";

interface Valuation {
  id: string;
  created_at: string;
  vin: string | null;
  plate: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  estimated_value: number | null;
}

export default function MyValuationsPage() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
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
          .from('valuations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setValuations(data);
      } catch (error: any) {
        toast.error('Failed to fetch valuations');
        console.error('Error:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuations();
  }, [user, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (value: number | null) => {
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
              <CardTitle>My Valuations</CardTitle>
              <CardDescription>View your saved vehicle valuations</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Loading valuations...</p>
              ) : valuations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No valuations found</p>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {valuations.map((valuation) => (
                      <TableRow
                        key={valuation.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/valuation/${valuation.id}`)}
                      >
                        <TableCell>{formatDate(valuation.created_at)}</TableCell>
                        <TableCell>
                          {valuation.year} {valuation.make} {valuation.model}
                        </TableCell>
                        <TableCell>
                          {valuation.vin ? `VIN: ${valuation.vin}` : `Plate: ${valuation.plate}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(valuation.estimated_value)}
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
