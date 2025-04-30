
import React, { useMemo } from 'react';
import { Check, Zap, Video, Wifi, Sun, Shield, Headphones, Thermometer, ParkingCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FeatureCategory {
  name: string;
  icon: React.ElementType;
  features: Feature[];
}

interface Feature {
  id: string;
  name: string;
  valueImpact: string;
  category: string;
  description?: string;
}

interface ComprehensiveFeatureSelectorProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  disabled?: boolean;
}

export function ComprehensiveFeatureSelector({
  selectedFeatures,
  onFeaturesChange,
  disabled = false
}: ComprehensiveFeatureSelectorProps) {
  // Sample premium features data grouped by category
  const featureCategories: FeatureCategory[] = useMemo(() => [
    {
      name: 'Comfort',
      icon: Sun,
      features: [
        { id: 'leather-seats', name: 'Leather Seats', valueImpact: '+$800', category: 'Comfort', description: 'Premium leather upholstery' },
        { id: 'heated-seats', name: 'Heated Seats', valueImpact: '+$600', category: 'Comfort', description: 'Front seats with heating elements' },
        { id: 'ventilated-seats', name: 'Ventilated Seats', valueImpact: '+$750', category: 'Comfort', description: 'Cooling airflow through seat surface' },
        { id: 'dual-climate', name: 'Dual Climate Control', valueImpact: '+$500', category: 'Comfort', description: 'Separate temperature zones' },
        { id: 'air-suspension', name: 'Air Suspension', valueImpact: '+$1,200', category: 'Comfort', description: 'Adjustable air-based suspension system' }
      ]
    },
    {
      name: 'Technology',
      icon: Wifi,
      features: [
        { id: 'navigation', name: 'Navigation System', valueImpact: '+$700', category: 'Technology', description: 'Built-in GPS navigation' },
        { id: 'premium-audio', name: 'Premium Audio', valueImpact: '+$900', category: 'Technology', description: 'High-end speaker system' },
        { id: 'head-up-display', name: 'Head-Up Display', valueImpact: '+$850', category: 'Technology', description: 'Projects info onto windshield' },
        { id: 'adaptive-cruise', name: 'Adaptive Cruise Control', valueImpact: '+$800', category: 'Technology', description: 'Maintains distance from vehicles ahead' },
        { id: 'wireless-charging', name: 'Wireless Charging', valueImpact: '+$350', category: 'Technology', description: 'Charges compatible devices without cables' }
      ]
    },
    {
      name: 'Performance',
      icon: Activity,
      features: [
        { id: 'sport-package', name: 'Sport Package', valueImpact: '+$1,500', category: 'Performance', description: 'Enhanced handling and performance' },
        { id: 'awd', name: 'All-Wheel Drive', valueImpact: '+$1,300', category: 'Performance', description: 'Power to all wheels for better traction' },
        { id: 'turbo', name: 'Turbocharged Engine', valueImpact: '+$1,200', category: 'Performance', description: 'Forced induction for more power' },
        { id: 'sport-exhaust', name: 'Sport Exhaust', valueImpact: '+$700', category: 'Performance', description: 'Enhanced exhaust sound and flow' },
        { id: 'sport-suspension', name: 'Sport Suspension', valueImpact: '+$800', category: 'Performance', description: 'Stiffer springs and dampers' }
      ]
    },
    {
      name: 'Safety',
      icon: Shield,
      features: [
        { id: 'blind-spot', name: 'Blind Spot Monitoring', valueImpact: '+$550', category: 'Safety', description: 'Alerts for vehicles in blind spots' },
        { id: 'lane-assist', name: 'Lane Assist', valueImpact: '+$600', category: 'Safety', description: 'Helps maintain lane position' },
        { id: 'parking-sensors', name: 'Parking Sensors', valueImpact: '+$450', category: 'Safety', description: 'Proximity alerts when parking' },
        { id: '360-camera', name: '360° Camera System', valueImpact: '+$850', category: 'Safety', description: 'Surround view for parking and maneuvering' },
        { id: 'auto-emergency-braking', name: 'Auto Emergency Braking', valueImpact: '+$700', category: 'Safety', description: 'Automatic braking to prevent collisions' }
      ]
    },
    {
      name: 'Convenience',
      icon: ParkingCircle,
      features: [
        { id: 'power-liftgate', name: 'Power Liftgate', valueImpact: '+$550', category: 'Convenience', description: 'Automatic opening/closing trunk' },
        { id: 'keyless-entry', name: 'Keyless Entry & Start', valueImpact: '+$450', category: 'Convenience', description: 'Enter and start without physical key' },
        { id: 'remote-start', name: 'Remote Start', valueImpact: '+$500', category: 'Convenience', description: 'Start vehicle remotely' },
        { id: 'auto-parking', name: 'Auto-Parking', valueImpact: '+$900', category: 'Convenience', description: 'Automatic parking assistance' },
        { id: 'hands-free-trunk', name: 'Hands-Free Trunk', valueImpact: '+$400', category: 'Convenience', description: 'Motion-activated trunk opening' }
      ]
    },
    {
      name: 'Entertainment',
      icon: Headphones,
      features: [
        { id: 'rear-entertainment', name: 'Rear Entertainment', valueImpact: '+$900', category: 'Entertainment', description: 'Screens for rear passengers' },
        { id: 'satellite-radio', name: 'Satellite Radio', valueImpact: '+$300', category: 'Entertainment', description: 'SiriusXM or similar service' },
        { id: 'premium-speakers', name: 'Premium Speakers', valueImpact: '+$750', category: 'Entertainment', description: 'High-end audio brands (Bose, etc.)' },
        { id: 'apple-carplay', name: 'Apple CarPlay/Android Auto', valueImpact: '+$350', category: 'Entertainment', description: 'Smartphone integration' },
        { id: 'wifi-hotspot', name: 'WiFi Hotspot', valueImpact: '+$400', category: 'Entertainment', description: 'In-vehicle internet connectivity' }
      ]
    }
  ], []);

  const toggleFeature = (featureId: string) => {
    if (disabled) return;
    
    if (selectedFeatures.includes(featureId)) {
      onFeaturesChange(selectedFeatures.filter(id => id !== featureId));
    } else {
      onFeaturesChange([...selectedFeatures, featureId]);
    }
  };

  return (
    <div className="space-y-6">
      {featureCategories.map((category) => (
        <div key={category.name} className="space-y-3">
          <div className="flex items-center gap-2">
            <category.icon className="h-5 w-5 text-primary" />
            <h3 className="text-base font-medium text-slate-700">{category.name}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {category.features.map((feature) => (
              <TooltipProvider key={feature.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div 
                      whileHover={{ scale: disabled ? 1 : 1.02 }}
                      whileTap={{ scale: disabled ? 1 : 0.98 }}
                      className={`
                        flex items-center gap-2 p-2.5 rounded-md border cursor-pointer transition-all
                        ${selectedFeatures.includes(feature.id)
                          ? 'bg-primary/10 border-primary shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => toggleFeature(feature.id)}
                    >
                      <div className={`
                        flex-shrink-0 w-5 h-5 rounded-full grid place-items-center
                        ${selectedFeatures.includes(feature.id)
                          ? 'bg-primary text-white'
                          : 'bg-slate-100'}
                      `}>
                        {selectedFeatures.includes(feature.id) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{feature.name}</p>
                      </div>
                      
                      <span className="text-xs font-semibold text-green-600">{feature.valueImpact}</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    {feature.description}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      ))}
      
      {selectedFeatures.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Selected Features:</span>
              <span className="text-sm">{selectedFeatures.length}</span>
            </div>
            <div className="text-green-600 font-medium">
              +${(selectedFeatures.length * 250).toLocaleString()} Value
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
