
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ValuationResult } from '@/types/valuation';
import { getUserValuations } from '@/services/valuationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatCurrency } from '@/utils/formatters';
import { CalendarClock, AlertTriangle, Car, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function MyValuationsPage() {
  const [valuations, setValuations] = useState<ValuationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchValuations() {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const data = await getUserValuations(user.id);
        setValuations(data);
      } catch (error) {
        console.error('Error fetching valuations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchValuations();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold">Loading your valuations...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // For testing, generate mock data if no valuations exist
  const mockValuations: ValuationResult[] = valuations.length > 0 ? [] : [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2018,
      mileage: 45000,
      condition: 'Good',
      zipCode: '90210',
      estimatedValue: 18500,
      confidenceScore: 85,
      isPremium: true,
      bestPhotoUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      mileage: 12000,
      condition: 'Excellent',
      zipCode: '10001',
      estimatedValue: 22750,
      confidenceScore: 92,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const allValuations = [...valuations, ...mockValuations];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Valuations</h1>
          <Button asChild>
            <Link to="/lookup">New Valuation</Link>
          </Button>
        </div>

        {allValuations.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Valuations Yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't created any vehicle valuations yet. Start by getting a valuation for your vehicle.
              </p>
              <Button asChild>
                <Link to="/lookup">Create Your First Valuation</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allValuations.map((valuation) => (
              <Card key={valuation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-primary/5 pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{valuation.year} {valuation.make} {valuation.model}</CardTitle>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <CalendarClock className="h-3.5 w-3.5 mr-1" />
                      {new Date(valuation.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Value</p>
                      <p className="font-semibold text-lg">{formatCurrency(valuation.estimatedValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-medium">{formatNumber(valuation.mileage)} mi</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Condition</p>
                      <p className="font-medium">{valuation.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <div className="flex items-center">
                        <div className="h-2 w-16 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{width: `${valuation.confidenceScore || 0}%`}}
                          ></div>
                        </div>
                        <span className="text-sm">{valuation.confidenceScore || 0}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <Link to={`/valuation/${valuation.id}`}>View Details</Link>
                    </Button>
                    
                    {valuation.isPremium ? (
                      <Button size="sm" variant="secondary" asChild>
                        <Link to={`/valuation/${valuation.id}/pdf`}>Download PDF</Link>
                      </Button>
                    ) : (
                      <Button size="sm" asChild>
                        <Link to={`/valuation/${valuation.id}/upgrade`}>Upgrade to Premium</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
