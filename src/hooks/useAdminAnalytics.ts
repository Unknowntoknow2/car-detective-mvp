
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types for analytics data
export interface AdminAnalytics {
  totalValuations: number;
  valuationsByMethod: { name: string; value: number }[];
  dailyValuations: { date: string; count: number }[];
  aiConfidence: number;
  aiPhotoUploads: number;
  aiOverridePercentage: number;
  revenueTotal: number;
  latestPayments: {
    id: string;
    user_id: string;
    amount: number;
    created_at: string;
    status: string;
  }[];
  conversionRate: number;
  topZipCodes: { zip: string; count: number }[];
}

export function useAdminAnalytics() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Get date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

        // Fetch total valuations
        const { count: totalValuations, error: valuationError } = await supabase
          .from('valuations')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgoStr);

        if (valuationError) throw valuationError;

        // Fetch valuations by method
        const { data: methodData, error: methodError } = await supabase
          .from('valuations')
          .select('is_vin_lookup, plate')
          .gte('created_at', thirtyDaysAgoStr);

        if (methodError) throw methodError;

        // Calculate valuations by method
        let vinCount = 0;
        let plateCount = 0;
        let manualCount = 0;

        methodData.forEach(val => {
          if (val.is_vin_lookup) vinCount++;
          else if (val.plate) plateCount++;
          else manualCount++;
        });

        const valuationsByMethod = [
          { name: 'VIN', value: vinCount },
          { name: 'Plate', value: plateCount },
          { name: 'Manual', value: manualCount }
        ];

        // Fetch daily valuations for the last 30 days
        const { data: dailyData, error: dailyError } = await supabase
          .from('valuations')
          .select('created_at')
          .gte('created_at', thirtyDaysAgoStr);

        if (dailyError) throw dailyError;

        // Group by day
        const dailyCounts: Record<string, number> = {};
        dailyData.forEach(item => {
          const date = new Date(item.created_at).toISOString().split('T')[0];
          dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });

        // Convert to array and sort by date
        const dailyValuations = Object.entries(dailyCounts)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        // Fetch AI stats - photo scores
        const { data: photoData, error: photoError } = await supabase
          .from('photo_scores')
          .select('score, metadata')
          .gte('created_at', thirtyDaysAgoStr);

        if (photoError) throw photoError;

        const aiPhotoUploads = photoData.length;
        const aiConfidence = photoData.length > 0
          ? photoData.reduce((sum, item) => {
              const metadata = typeof item.metadata === 'object' ? item.metadata : {};
              // Fix: Access metadata as a record with optional properties
              const confidenceScore = metadata && typeof metadata === 'object' 
                ? (metadata as Record<string, any>).confidenceScore || 0 
                : 0;
              return sum + confidenceScore;
            }, 0) / photoData.length
          : 0;

        // Estimate AI override percentage (would need additional data tracking in a real app)
        const aiOverridePercentage = 0.15; // Placeholder value

        // Fetch revenue data
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('status', 'paid')
          .gte('created_at', thirtyDaysAgoStr);

        if (orderError) throw orderError;

        const revenueTotal = orderData.reduce((sum, order) => sum + order.amount, 0);

        // Get latest 5 payments
        const { data: latestPayments, error: latestPaymentsError } = await supabase
          .from('orders')
          .select('*')
          .eq('status', 'paid')
          .order('created_at', { ascending: false })
          .limit(5);

        if (latestPaymentsError) throw latestPaymentsError;

        // Calculate conversion rate
        const conversionRate = totalValuations && totalValuations > 0
          ? orderData.length / totalValuations
          : 0;

        // Fetch top ZIP codes
        const { data: zipData, error: zipError } = await supabase
          .from('valuations')
          .select('state')
          .not('state', 'is', null)
          .gte('created_at', thirtyDaysAgoStr);

        if (zipError) throw zipError;

        // Count occurrences of each ZIP
        const zipCounts: Record<string, number> = {};
        zipData.forEach(item => {
          if (item.state) {
            zipCounts[item.state] = (zipCounts[item.state] || 0) + 1;
          }
        });

        // Convert to array and sort by count
        const topZipCodes = Object.entries(zipCounts)
          .map(([zip, count]) => ({ zip, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Set all data
        setData({
          totalValuations: totalValuations || 0,
          valuationsByMethod,
          dailyValuations,
          aiConfidence,
          aiPhotoUploads,
          aiOverridePercentage,
          revenueTotal,
          latestPayments,
          conversionRate,
          topZipCodes
        });

      } catch (err) {
        console.error('Error fetching admin analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}
