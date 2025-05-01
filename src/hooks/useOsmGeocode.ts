
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OsmGeocodeFeature {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

export interface OsmGeocodeResult {
  data: OsmGeocodeFeature[];
  source: 'api' | 'cache';
}

export function useOsmGeocode(zip: string) {
  return useQuery({
    queryKey: ['osmGeocode', zip],
    queryFn: async () => {
      try {
        // Only run the query if we have a valid ZIP
        if (!zip || !/^\d{5}$/.test(zip)) {
          return null;
        }

        const { data, error } = await supabase.functions.invoke('fetch_osm_geocode', {
          body: { zip },
        });

        if (error) {
          console.error('OSM geocode fetch error:', error);
          throw new Error(error.message || 'Failed to fetch location data');
        }

        return data as OsmGeocodeResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch location data';
        console.error('OSM geocode hook error:', err);
        toast.error(errorMsg);
        throw err;
      }
    },
    enabled: Boolean(zip) && /^\d{5}$/.test(zip),
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
}
