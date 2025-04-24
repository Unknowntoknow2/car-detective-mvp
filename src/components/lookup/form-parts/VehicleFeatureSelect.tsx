
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Flame, Shield, Star, Zap, CheckCircle, DollarSign, Plus, Music, WifiIcon } from 'lucide-react';

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
  const [totalValueImpact, setTotalValueImpact] = useState(0);

  // Category icons mapping for visual appeal
  const categoryIcons: Record<string, JSX.Element> = {
    "Safety": <Shield className="h-4 w-4 text-blue-500" />,
    "Entertainment": <Music className="h-4 w-4 text-purple-500" />,
    "Comfort": <Star className="h-4 w-4 text-yellow-500" />,
    "Performance": <Flame className="h-4 w-4 text-red-500" />,
    "Technology": <WifiIcon className="h-4 w-4 text-green-500" />,
    "Connectivity": <Zap className="h-4 w-4 text-cyan-500" />,
    "Other": <Plus className="h-4 w-4 text-gray-500" />
  };

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .order('category, name');
        
        if (!error && data) {
          setFeatures(data);
        } else {
          // Fallback data if supabase query fails
          setFeatures([
            { id: '1', name: 'Leather Seats', category: 'Comfort', value_impact: 500 },
            { id: '2', name: 'Sunroof', category: 'Comfort', value_impact: 400 },
            { id: '3', name: 'Navigation System', category: 'Technology', value_impact: 600 },
            { id: '4', name: 'Bluetooth', category: 'Connectivity', value_impact: 200 },
            { id: '5', name: 'Backup Camera', category: 'Safety', value_impact: 350 },
            { id: '6', name: 'Heated Seats', category: 'Comfort', value_impact: 450 },
            { id: '7', name: 'Premium Audio', category: 'Entertainment', value_impact: 750 },
            { id: '8', name: 'Adaptive Cruise Control', category: 'Safety', value_impact: 800 },
            { id: '9', name: 'Turbocharged Engine', category: 'Performance', value_impact: 1200 },
            { id: '10', name: 'All-Wheel Drive', category: 'Performance', value_impact: 1000 },
          ]);
        }
      } catch (err) {
        console.error("Error loading features:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  useEffect(() => {
    // Calculate total value impact from selected features
    const total = selectedFeatures.reduce((sum, featureId) => {
      const feature = features.find(f => f.id === featureId);
      return sum + (feature?.value_impact || 0);
    }, 0);
    
    setTotalValueImpact(total);
  }, [selectedFeatures, features]);

  const toggleFeature = (featureId: string) => {
    if (disabled) return;
    
    const newSelected = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    onFeaturesChange(newSelected);
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="animate-pulse flex justify-center">
          <div className="h-10 w-10 bg-primary/20 rounded-full"></div>
        </div>
        <div className="text-sm text-muted-foreground">Loading vehicle features...</div>
      </div>
    );
  }

  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Vehicle Features</label>
        {selectedFeatures.length > 0 && (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{selectedFeatures.length} selected</span>
            <DollarSign className="h-4 w-4 text-emerald-500 ml-2" />
            <span className="text-sm font-medium text-emerald-600">+${totalValueImpact}</span>
          </div>
        )}
      </div>
      
      <ScrollArea className="h-[250px] rounded-md border p-4 bg-white">
        {categories.map((category, idx) => (
          <div key={category} className="mb-4">
            {idx > 0 && <Separator className="my-3" />}
            <h4 className="text-sm font-semibold mb-3 flex items-center">
              {categoryIcons[category] || categoryIcons['Other']}
              <span className="ml-2">{category}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {features
                .filter(f => f.category === category)
                .map(feature => (
                  <Badge
                    key={feature.id}
                    variant={selectedFeatures.includes(feature.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedFeatures.includes(feature.id) 
                        ? 'bg-primary/90 hover:bg-primary/80' 
                        : 'hover:bg-primary/10'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <span>{feature.name}</span>
                    <span className={`ml-1.5 text-xs font-medium ${
                      selectedFeatures.includes(feature.id) ? 'text-primary-foreground' : 'text-green-600'
                    }`}>
                      +${feature.value_impact}
                    </span>
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {selectedFeatures.length > 0 && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-800">Feature Value Impact</span>
            <span className="font-bold text-emerald-700">+${totalValueImpact}</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1">
            Premium features can significantly increase your vehicle's value and attract more potential buyers.
          </p>
        </div>
      )}
    </div>
  );
};
