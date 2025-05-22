
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { downloadValuationPdf } from '@/utils/pdf/generateValuationPdf';

interface Valuation {
  id: string;
  created_at: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  estimated_value: number;
  condition: string;
  zip_code: string;
  exterior_color?: string;
  interior_color?: string;
  mileage?: number;
  ai_summary?: string;
  ai_score?: number;
  confidence_score?: number;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchValuations() {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching valuations:', error);
          toast.error('Could not load valuation history');
        } else {
          setValuations(data || []);
        }
      } catch (err) {
        console.error('Error fetching valuations:', err);
        toast.error('Failed to load valuation history');
      } finally {
        setIsLoading(false);
      }
    }

    fetchValuations();
  }, [user, navigate]);

  const columns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }: { row: { getValue: (key: string) => any } }) => new Date(row.getValue('created_at')).toLocaleDateString(),
    },
    {
      accessorKey: 'year',
      header: 'Year',
    },
    {
      accessorKey: 'make',
      header: 'Make',
    },
    {
      accessorKey: 'model',
      header: 'Model',
    },
    {
      accessorKey: 'trim',
      header: 'Trim',
    },
    {
      accessorKey: 'condition',
      header: 'Condition',
    },
    {
      accessorKey: 'zip_code',
      header: 'Zip Code',
    },
    {
      accessorKey: 'estimated_value',
      header: 'Estimated Value',
      cell: ({ row }: { row: { getValue: (key: string) => any } }) => {
        const value = row.getValue('estimated_value');
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      },
    },
    {
      accessorKey: 'ai_summary',
      header: 'AI Summary',
    },
    {
      accessorKey: 'ai_score',
      header: 'AI Score',
    },
    {
      accessorKey: 'confidence_score',
      header: 'Confidence',
      cell: ({ row }: { row: { original: Valuation } }) => {
        const valuation = row.original;
        const confidenceDisplay = valuation.confidence_score ? `${valuation.confidence_score}%` : 'N/A';
        return confidenceDisplay;
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Valuation } }) => (
        <Button variant="outline" size="sm" onClick={() => {
          const valuation = row.original;
          downloadValuationPdf({
            year: valuation.year,
            make: valuation.make,
            model: valuation.model,
            trim: valuation.trim || '',
            vin: 'N/A',
            estimatedValue: valuation.estimated_value,
            photoScore: valuation.ai_score || 0,
            bestPhotoUrl: '',
          });
        }}>
          Download PDF
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Loading your valuation history</h2>
          <p className="text-muted-foreground mt-1">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Your Valuation History</h1>
      {valuations.length > 0 ? (
        <DataTable columns={columns} data={valuations} />
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">No valuations found.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
