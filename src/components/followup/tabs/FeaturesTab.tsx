
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Settings, Zap, Car } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  onUpdate: (updates: Partial<FollowUpAnswers>) => void;
}

interface FeatureItem {
  name: string;
  priceRange: string;
  impact: string;
}

interface FeatureCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: FeatureItem[];
}

const featureCategories: FeatureCategory[] = [
  {
    name: 'Comfort & Convenience',
    icon: Star,
    color: 'bg-blue-50 border-blue-200',
    features: [
      { name: 'Leather Seats', priceRange: '+$800-$1,200', impact: 'High in luxury/midsize vehicles' },
      { name: 'Heated Seats', priceRange: '+$400-$600', impact: 'Strong value in cold climates' },
      { name: 'Cooled/Ventilated Seats', priceRange: '+$500-$800', impact: 'High in luxury or southern states' },
      { name: 'Power Seats', priceRange: '+$250-$400', impact: 'Often standard in mid/high trims' },
      { name: 'Memory Seats', priceRange: '+$200-$350', impact: 'Strong appeal for dual-driver vehicles' },
      { name: 'Sunroof/Moonroof', priceRange: '+$500-$800', impact: 'Adds value if panoramic' },
      { name: 'Panoramic Roof', priceRange: '+$800-$1,200', impact: 'Luxury feature; strong visual appeal' },
      { name: 'Keyless Entry', priceRange: '+$200-$300', impact: 'Often standard; modest resale benefit' },
      { name: 'Push Button Start', priceRange: '+$200-$300', impact: 'Mild bump, unless combined with remote start' },
      { name: 'Remote Start', priceRange: '+$300-$500', impact: 'High value in winter states' },
      { name: 'Dual Zone Climate Control', priceRange: '+$200-$400', impact: 'Seen as standard in mid-tier+' },
      { name: 'Heated Steering Wheel', priceRange: '+$250-$400', impact: 'Appealing in colder states' }
    ]
  },
  {
    name: 'Technology & Entertainment',
    icon: Settings,
    color: 'bg-purple-50 border-purple-200',
    features: [
      { name: 'Navigation System', priceRange: '+$300-$600', impact: 'Reduced impact due to phone use' },
      { name: 'Premium Audio System', priceRange: '+$400-$700', impact: 'Higher in luxury brands (BOSE, B&O)' },
      { name: 'Apple CarPlay/Android Auto', priceRange: '+$300-$500', impact: 'Expected in 2020+ vehicles; high demand' },
      { name: 'Bluetooth Connectivity', priceRange: '+$200-$300', impact: 'Standard in most trims' },
      { name: 'Wireless Phone Charging', priceRange: '+$200-$400', impact: 'Emerging expectation in 2022+ cars' },
      { name: 'WiFi Hotspot', priceRange: '+$150-$300', impact: 'Limited resale effect; useful in family vehicles' },
      { name: 'Rear Entertainment System', priceRange: '+$600-$1,200', impact: 'High for SUVs/minivans with kids' },
      { name: 'Digital Instrument Cluster', priceRange: '+$300-$500', impact: 'Strong in EVs/luxury segments' },
      { name: 'Heads-Up Display', priceRange: '+$500-$700', impact: 'Luxury signal; rare in base trims' }
    ]
  },
  {
    name: 'Safety & Driver Assistance',
    icon: Shield,
    color: 'bg-green-50 border-green-200',
    features: [
      { name: 'Backup Camera', priceRange: '+$300-$400', impact: 'Mandatory since 2018' },
      { name: 'Blind Spot Monitoring', priceRange: '+$400-$600', impact: 'Growing expectation in 2020+' },
      { name: 'Lane Departure Warning', priceRange: '+$300-$500', impact: 'Stronger in family vehicles and SUVs' },
      { name: 'Lane Keep Assist', priceRange: '+$400-$600', impact: 'High demand in modern cars' },
      { name: 'Adaptive Cruise Control', priceRange: '+$600-$800', impact: 'Premium feature – especially in EVs' },
      { name: 'Forward Collision Warning', priceRange: '+$400-$700', impact: 'Often bundled with AEB' },
      { name: 'Automatic Emergency Braking', priceRange: '+$500-$800', impact: 'Big value signal; now standard on many trims' },
      { name: 'Parking Sensors', priceRange: '+$250-$400', impact: 'Common in midsize/luxury vehicles' },
      { name: '360-Degree Camera', priceRange: '+$600-$1,000', impact: 'Luxury-level tech – rare in base trims' },
      { name: 'Cross Traffic Alert', priceRange: '+$350-$500', impact: 'Strong when bundled with BSM' },
      { name: 'Driver Attention Monitor', priceRange: '+$200-$400', impact: 'Still rare; emerging value feature' },
      { name: 'Night Vision', priceRange: '+$1,000-$1,500', impact: 'Extremely rare; only high-end luxury/EVs' }
    ]
  },
  {
    name: 'Performance & Drivetrain',
    icon: Zap,
    color: 'bg-orange-50 border-orange-200',
    features: [
      { name: 'All-Wheel Drive (AWD)', priceRange: '+$800-$1,200', impact: 'Huge value in snowbelt states' },
      { name: 'Four-Wheel Drive (4WD)', priceRange: '+$900-$1,400', impact: 'Strong for trucks, SUVs, off-roaders' },
      { name: 'Turbocharged Engine', priceRange: '+$400-$800', impact: 'Expected in sport trims' },
      { name: 'Supercharged Engine', priceRange: '+$1,000-$2,000', impact: 'Performance/luxury models only' },
      { name: 'Sport Mode', priceRange: '+$150-$300', impact: 'Minimal resale impact' },
      { name: 'Paddle Shifters', priceRange: '+$250-$400', impact: 'Slight lift in sport trims' },
      { name: 'Limited Slip Differential', priceRange: '+$400-$800', impact: 'Valuable in performance/RWD cars' },
      { name: 'Air Suspension', priceRange: '+$1,200-$2,000', impact: 'High maintenance cost – value depends on condition' },
      { name: 'Adaptive Suspension', priceRange: '+$600-$1,000', impact: 'Performance luxury only' },
      { name: 'Sport Exhaust', priceRange: '+$400-$800', impact: 'High-end trims or aftermarket premium' },
      { name: 'Performance Tires', priceRange: '+$200-$500', impact: 'Must be in good condition' },
      { name: 'Brembo Brakes', priceRange: '+$500-$900', impact: 'Performance cars (Mustang, M3, WRX, etc.)' }
    ]
  },
  {
    name: 'Exterior & Utility',
    icon: Car,
    color: 'bg-indigo-50 border-indigo-200',
    features: [
      { name: 'Alloy Wheels', priceRange: '+$200-$400', impact: 'Standard in most cars; less if aftermarket' },
      { name: 'Premium Wheels', priceRange: '+$400-$800', impact: 'Adds flair, value if branded (AMG, M)' },
      { name: 'Running Boards', priceRange: '+$300-$500', impact: 'Trucks/SUVs only' },
      { name: 'Roof Rack', priceRange: '+$150-$300', impact: 'Higher in outdoor/off-road markets' },
      { name: 'Towing Package', priceRange: '+$500-$1,000', impact: 'Very strong for trucks/SUVs' },
      { name: 'Trailer Hitch', priceRange: '+$300-$600', impact: 'Useful, especially when OEM-installed' },
      { name: 'Power Liftgate', priceRange: '+$300-$500', impact: 'Expected in SUVs over $30K' },
      { name: 'Hands-Free Liftgate', priceRange: '+$500-$700', impact: 'Tech SUVs and minivans; premium resale item' },
      { name: 'Bed Liner (Trucks)', priceRange: '+$250-$450', impact: 'Essential for truck protection' },
      { name: 'Tonneau Cover (Trucks)', priceRange: '+$300-$600', impact: 'Premium truck resale item' },
      { name: 'Third Row Seating', priceRange: '+$800-$1,200', impact: 'High impact in midsize SUVs, family haulers' },
      { name: 'Captains Chairs', priceRange: '+$400-$700', impact: 'Popular in minivans/3-row SUVs' }
    ]
  }
];

export function FeaturesTab({ formData, onUpdate }: FeaturesTabProps) {
  const selectedFeatures = formData.features || [];

  const toggleFeature = (featureName: string) => {
    const newFeatures = selectedFeatures.includes(featureName)
      ? selectedFeatures.filter(f => f !== featureName)
      : [...selectedFeatures, featureName];
    
    onUpdate({ features: newFeatures });
  };

  const calculateTotalValue = () => {
    // Simple calculation - in real app, this would use more sophisticated pricing
    return selectedFeatures.length * 400; // Average $400 per feature
  };

  return (
    <div className="space-y-6">
      {selectedFeatures.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Selected Features</h3>
                <p className="text-blue-700 text-sm">{selectedFeatures.length} features selected</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                ~+${calculateTotalValue().toLocaleString()} estimated value
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {featureCategories.map((category) => {
        const CategoryIcon = category.icon;
        return (
          <Card key={category.name} className={category.color}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5" />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.features.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.name);
                  return (
                    <div
                      key={feature.name}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-white border-primary shadow-sm' 
                          : 'bg-white/50 border-gray-200 hover:bg-white hover:border-gray-300'
                      }`}
                      onClick={() => toggleFeature(feature.name)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleFeature(feature.name)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <Label className="font-medium cursor-pointer">
                              {feature.name}
                            </Label>
                            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                              {feature.priceRange}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {feature.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
