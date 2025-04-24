
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

interface Feature {
  id: string;
  name: string;
  category: string;
  value_impact: number;
}

interface VehicleFeatureSelectProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  disabled?: boolean;
}

export const VehicleFeatureSelect = ({
  selectedFeatures,
  onFeaturesChange,
  disabled = false
}: VehicleFeatureSelectProps) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('category, name');
      
      if (!error && data) {
        setFeatures(data);
      }
      setLoading(false);
    };

    fetchFeatures();
  }, []);

  const toggleFeature = (featureId: string) => {
    if (disabled) return;
    
    const newSelected = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    onFeaturesChange(newSelected);
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading features...</div>;
  }

  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Vehicle Features</label>
      <ScrollArea className="h-[200px] rounded-md border p-4">
        {categories.map((category, idx) => (
          <div key={category}>
            {idx > 0 && <Separator className="my-2" />}
            <h4 className="text-sm font-semibold mb-2">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {features
                .filter(f => f.category === category)
                .map(feature => (
                  <Badge
                    key={feature.id}
                    variant={selectedFeatures.includes(feature.id) ? "default" : "outline"}
                    className={`cursor-pointer ${disabled ? 'opacity-50' : ''}`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    {feature.name} (+${feature.value_impact})
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
