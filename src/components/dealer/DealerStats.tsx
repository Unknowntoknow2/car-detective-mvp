
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const DealerStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['dealer-stats'],
    queryFn: async () => {
      const { count } = await supabase
        .from('valuations')
        .select('*', { count: 'exact' });
      
      return {
        totalValuations: count || 0,
      };
    }
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Valuations</p>
          <p className="text-2xl font-bold">{stats?.totalValuations || 0}</p>
        </div>
      </div>
    </Card>
  );
};
