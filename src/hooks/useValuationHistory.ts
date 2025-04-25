
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Valuation } from "@/types/valuation-history";

export function useValuationHistory() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchValuations = async () => {
      try {
        // Get saved valuations
        const { data: savedValuations, error: savedError } = await supabase
          .from('saved_valuations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (savedError) throw savedError;
        
        // Format saved valuations
        const formattedValuations = savedValuations?.map(val => ({
          id: val.id,
          created_at: val.created_at,
          make: val.make,
          model: val.model,
          year: val.year,
          vin: val.vin,
          valuation: val.valuation,
          is_premium: false
        })) || [];
        
        // Get premium valuations from orders
        const { data: premiumOrders, error: ordersError } = await supabase
          .from('orders')
          .select('*, valuations(*)')
          .eq('user_id', user.id)
          .eq('status', 'completed');
        
        if (ordersError) throw ordersError;
        
        // Format premium valuations
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

  return { valuations, isLoading };
}
