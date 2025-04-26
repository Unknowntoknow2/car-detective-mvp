
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { CheckCircle, Star, Plus, Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Feature {
  id: string;
  name: string;
  category: string;
  value_impact: number;
  description?: string;
}

interface ComprehensiveFeatureSelectorProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  disabled?: boolean;
}

// Category icons for visual appeal
const CATEGORY_ICONS: Record<string, JSX.Element> = {
  "Safety": <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Safety</Badge>,
  "Entertainment": <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Entertainment</Badge>,
  "Comfort": <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Comfort</Badge>,
  "Performance": <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Performance</Badge>,
  "Technology": <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Technology</Badge>,
  "Connectivity": <Badge variant="outline" className="bg-cyan-50 text-cyan-600 border-cyan-200">Connectivity</Badge>,
  "Exterior": <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Exterior</Badge>,
  "Interior": <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200">Interior</Badge>,
  "Other": <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Other</Badge>
};

// Default feature categories if database is empty
const DEFAULT_FEATURES: Feature[] = [
  // Safety features
  { id: 'safety_1', name: 'Adaptive Cruise Control', category: 'Safety', value_impact: 800 },
  { id: 'safety_2', name: 'Blind Spot Monitor', category: 'Safety', value_impact: 600 },
  { id: 'safety_3', name: 'Lane Departure Warning', category: 'Safety', value_impact: 500 },
  { id: 'safety_4', name: 'Forward Collision Warning', category: 'Safety', value_impact: 700 },
  { id: 'safety_5', name: 'Automatic Emergency Braking', category: 'Safety', value_impact: 900 },
  { id: 'safety_6', name: 'Backup Camera', category: 'Safety', value_impact: 350 },
  { id: 'safety_7', name: '360-Degree Camera', category: 'Safety', value_impact: 1100 },
  { id: 'safety_8', name: 'Parking Sensors', category: 'Safety', value_impact: 450 },
  
  // Entertainment features
  { id: 'entertainment_1', name: 'Premium Audio System', category: 'Entertainment', value_impact: 750 },
  { id: 'entertainment_2', name: 'Rear Seat Entertainment', category: 'Entertainment', value_impact: 900 },
  { id: 'entertainment_3', name: 'Wireless Charging', category: 'Entertainment', value_impact: 400 },
  { id: 'entertainment_4', name: 'Multi-Zone Climate Control', category: 'Entertainment', value_impact: 500 },
  
  // Comfort features
  { id: 'comfort_1', name: 'Leather Seats', category: 'Comfort', value_impact: 500 },
  { id: 'comfort_2', name: 'Heated Seats', category: 'Comfort', value_impact: 450 },
  { id: 'comfort_3', name: 'Ventilated Seats', category: 'Comfort', value_impact: 650 },
  { id: 'comfort_4', name: 'Heated Steering Wheel', category: 'Comfort', value_impact: 350 },
  { id: 'comfort_5', name: 'Power Adjustable Seats', category: 'Comfort', value_impact: 400 },
  { id: 'comfort_6', name: 'Memory Seats', category: 'Comfort', value_impact: 550 },
  { id: 'comfort_7', name: 'Massage Seats', category: 'Comfort', value_impact: 850 },
  
  // Technology features
  { id: 'tech_1', name: 'Navigation System', category: 'Technology', value_impact: 600 },
  { id: 'tech_2', name: 'Head-Up Display', category: 'Technology', value_impact: 800 },
  { id: 'tech_3', name: 'Digital Instrument Cluster', category: 'Technology', value_impact: 700 },
  { id: 'tech_4', name: 'Touchscreen Infotainment', category: 'Technology', value_impact: 500 },
  
  // Exterior features
  { id: 'exterior_1', name: 'Sunroof/Moonroof', category: 'Exterior', value_impact: 600 },
  { id: 'exterior_2', name: 'Panoramic Roof', category: 'Exterior', value_impact: 900 },
  { id: 'exterior_3', name: 'LED Headlights', category: 'Exterior', value_impact: 450 },
  { id: 'exterior_4', name: 'Fog Lights', category: 'Exterior', value_impact: 200 },
  { id: 'exterior_5', name: 'Roof Rails', category: 'Exterior', value_impact: 250 },
  { id: 'exterior_6', name: 'Power Liftgate', category: 'Exterior', value_impact: 550 },
  
  // Performance features
  { id: 'performance_1', name: 'Turbocharged Engine', category: 'Performance', value_impact: 1200 },
  { id: 'performance_2', name: 'All-Wheel Drive', category: 'Performance', value_impact: 1000 },
  { id: 'performance_3', name: 'Sport Suspension', category: 'Performance', value_impact: 800 },
  { id: 'performance_4', name: 'Performance Tires', category: 'Performance', value_impact: 600 },
  { id: 'performance_5', name: 'Performance Brakes', category: 'Performance', value_impact: 750 },
];

export function ComprehensiveFeatureSelector({
  selectedFeatures,
  onFeaturesChange,
  disabled = false
}: ComprehensiveFeatureSelectorProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalValueImpact, setTotalValueImpact] = useState(0);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .order('category, name');
        
        if (!error && data && data.length > 0) {
          setFeatures(data);
        } else {
          // Fallback to default features if database is empty or has an error
          setFeatures(DEFAULT_FEATURES);
        }
      } catch (err) {
        console.error("Error loading features:", err);
        setFeatures(DEFAULT_FEATURES);
      } finally {
        setIsLoading(false);
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

  // Get all unique categories
  const categories = ['all', ...Array.from(new Set(features.map(f => f.category)))];

  // Filter features based on active category and search query
  const filteredFeatures = features.filter(feature => {
    const matchesCategory = activeCategory === 'all' || feature.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
                          feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feature.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group filtered features by category
  const featuresByCategory = filteredFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  if (isLoading) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="animate-pulse flex justify-center">
          <div className="h-10 w-10 bg-primary/20 rounded-full"></div>
        </div>
        <div className="text-sm text-muted-foreground">Loading vehicle features...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium text-lg">Premium Features</h3>
        </div>
        {selectedFeatures.length > 0 && (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{selectedFeatures.length} selected</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full flex overflow-x-auto pb-1 gap-1 h-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex-shrink-0 capitalize py-1 px-3 h-auto"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-4">
          <ScrollArea className="h-[300px] rounded-md border p-4 bg-white">
            {activeCategory === 'all' ? (
              // Show all categories
              Object.entries(featuresByCategory).map(([category, categoryFeatures], idx) => (
                <div key={category} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    {CATEGORY_ICONS[category] || CATEGORY_ICONS['Other']}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categoryFeatures.map(feature => (
                      <Badge
                        key={feature.id}
                        variant={selectedFeatures.includes(feature.id) ? "default" : "outline"}
                        className={`cursor-pointer transition-all gap-1.5 py-1.5 px-2.5 ${
                          selectedFeatures.includes(feature.id) 
                            ? 'bg-primary hover:bg-primary/90' 
                            : 'hover:bg-primary/10'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => toggleFeature(feature.id)}
                      >
                        <span>{feature.name}</span>
                        <span className={`text-xs font-medium ${
                          selectedFeatures.includes(feature.id) ? 'text-primary-foreground' : 'text-green-600'
                        }`}>
                          +${feature.value_impact}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Show specific category
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {filteredFeatures.map(feature => (
                    <Badge
                      key={feature.id}
                      variant={selectedFeatures.includes(feature.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-all gap-1.5 py-1.5 px-2.5 ${
                        selectedFeatures.includes(feature.id) 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'hover:bg-primary/10'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => toggleFeature(feature.id)}
                    >
                      <span>{feature.name}</span>
                      <span className={`text-xs font-medium ${
                        selectedFeatures.includes(feature.id) ? 'text-primary-foreground' : 'text-green-600'
                      }`}>
                        +${feature.value_impact}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedFeatures.length > 0 && (
        <div className="p-4 rounded bg-green-50 border border-green-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">Feature Value Impact</span>
            <span className="font-bold text-green-700">+${totalValueImpact}</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Premium features can significantly increase your vehicle's value and attract more potential buyers.
          </p>
        </div>
      )}
    </div>
  );
}
