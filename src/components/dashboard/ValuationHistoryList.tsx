
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, FileText, Eye, ExternalLink } from 'lucide-react';

interface Valuation {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  estimated_value: number;
  vin?: string;
  premium_unlocked: boolean;
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
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setValuations(data || []);
      } catch (error: any) {
        console.error('Error fetching valuation history:', error.message);
        toast.error('Failed to load valuation history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuations();
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
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
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="mb-4">Get your first vehicle valuation to see it here</p>
          <Button onClick={() => navigate('/valuation')}>
            Start New Valuation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Valuations</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/valuation')}
        >
          New Valuation
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {valuations.map((valuation) => (
          <Card key={valuation.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {valuation.make} {valuation.model}
                </CardTitle>
                {valuation.premium_unlocked && (
                  <div className="flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Premium
                  </div>
                )}
              </div>
              <CardDescription>
                {valuation.year} {valuation.vin ? `• VIN: ${valuation.vin.substring(0, 6)}...` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Estimated Value</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(valuation.estimated_value)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(valuation.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/valuation/results/${valuation.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    // Generate shareable link
                    const url = `${window.location.origin}/valuation/results/${valuation.id}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
