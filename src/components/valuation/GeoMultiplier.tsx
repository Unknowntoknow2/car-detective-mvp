
import React from 'react';
import { useOsmGeocode } from '@/hooks/useOsmGeocode';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';

interface GeoMultiplierProps {
  zip: string;
}

export const GeoMultiplier: React.FC<GeoMultiplierProps> = ({ zip }) => {
  const { data, isLoading, error } = useOsmGeocode(zip);
  
  const getLocationImpact = (geocodeData: any): { percentage: number; description: string } => {
    if (!geocodeData?.data || geocodeData.data.length === 0) {
      return { percentage: 0, description: 'Location data unavailable' };
    }
    
    // Get the first result
    const location = geocodeData.data[0];
    
    // Check if it's a high-density area based on the location type and class
    const isUrban = location.type === 'city' || 
                   location.type === 'town' || 
                   location.display_name.toLowerCase().includes('new york') ||
                   location.display_name.toLowerCase().includes('los angeles') ||
                   location.display_name.toLowerCase().includes('chicago') ||
                   location.display_name.toLowerCase().includes('san francisco');
    
    if (isUrban) {
      return { 
        percentage: 4, 
        description: 'High-density urban area adds value' 
      };
    }
    
    const isSuburban = location.type === 'suburb' || 
                      location.type === 'residential' ||
                      location.display_name.toLowerCase().includes('county');
    
    if (isSuburban) {
      return { 
        percentage: 2, 
        description: 'Suburban area adds modest value' 
      };
    }
    
    return { 
      percentage: 0, 
      description: 'Rural or standard area' 
    };
  };
  
  const impact = data ? getLocationImpact(data) : { percentage: 0, description: 'Processing location data' };

  if (isLoading) {
    return (
      <Card className="bg-primary-50 border border-primary-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-sm text-primary-700">Analyzing location data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.data.length === 0) {
    return null;
  }

  const locationName = data.data[0].display_name.split(',').slice(0, 2).join(', ');

  return (
    <Card className={`${impact.percentage > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <MapPin className={`h-5 w-5 ${impact.percentage > 0 ? 'text-green-600' : 'text-gray-600'} mt-0.5`} />
          <div>
            <h4 className="text-sm font-medium">Location: {locationName}</h4>
            <p className="text-xs mt-1 font-medium">
              {impact.percentage > 0 ? (
                <span className="text-green-600">+{impact.percentage}% value adjustment</span>
              ) : (
                <span className="text-gray-600">No value adjustment</span>
              )}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">{impact.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
