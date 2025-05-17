
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Car, ArrowRight, Calendar, Gauge } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/utils/formatters';
import { MainLayout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';

const MyValuationsPage: React.FC = () => {
  const [valuations, setValuations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSavedValuations = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('saved_valuations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setValuations(data || []);
      } catch (error) {
        console.error('Error fetching saved valuations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedValuations();
  }, [user]);

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Valuations</h1>
        
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        ) : valuations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No saved valuations</h2>
              <p className="text-muted-foreground mb-6">
                You haven't created any vehicle valuations yet.
              </p>
              <Button asChild>
                <Link to="/valuation">Create Your First Valuation</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valuations.map((valuation) => (
              <Card key={valuation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-muted/40 pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>{valuation.year} {valuation.make} {valuation.model}</span>
                    <span className="text-primary font-bold">
                      {formatCurrency(valuation.valuation || 0)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(valuation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Gauge className="h-4 w-4 mr-2" />
                        <span>
                          {valuation.confidence_score ? `${valuation.confidence_score}% Confidence` : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link to={`/valuation/${valuation.id}`}>
                        <span>View Details</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyValuationsPage;
