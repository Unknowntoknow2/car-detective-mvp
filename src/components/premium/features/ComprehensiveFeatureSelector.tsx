
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, DollarSign, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Feature {
  id: string;
  name: string;
  category: string;
  value_impact: number;
  description?: string;
}

interface FeatureCategory {
  name: string;
  icon: React.ReactNode;
  features: Feature[];
}

interface ComprehensiveFeatureSelectorProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  disabled?: boolean;
}

// Category icons mapping - you can customize these with your preferred Lucide icons
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    default:
      return <div className="h-4 w-4 rounded-full bg-primary/20" />;
  }
};

export function ComprehensiveFeatureSelector({
  selectedFeatures,
  onFeaturesChange,
  disabled = false
}: ComprehensiveFeatureSelectorProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [totalAddedValue, setTotalAddedValue] = useState(0);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .order('category')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setFeatures(data);
          
          // Group features by category
          const groupedByCategory = data.reduce((acc: Record<string, Feature[]>, feature) => {
            if (!acc[feature.category]) {
              acc[feature.category] = [];
            }
            acc[feature.category].push(feature);
            return acc;
          }, {});
          
          // Create category objects with icons
          const categoryData = Object.entries(groupedByCategory).map(([name, features]) => ({
            name,
            icon: getCategoryIcon(name),
            features
          }));
          
          setCategories(categoryData);
        }
      } catch (error) {
        console.error('Error fetching features:', error);
        // Fallback data - ideally would come from a local source
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  useEffect(() => {
    // Calculate total value impact
    const total = selectedFeatures.reduce((sum, featureId) => {
      const feature = features.find(f => f.id === featureId);
      return sum + (feature?.value_impact || 0);
    }, 0);
    
    setTotalAddedValue(total);
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
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-slate-600">Loading features...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-slate-700">Premium Features</h3>
        
        {selectedFeatures.length > 0 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{selectedFeatures.length} selected</span>
            <span className="text-sm font-medium ml-1">+${totalAddedValue}</span>
          </motion.div>
        )}
      </div>
      
      <p className="text-sm text-slate-500">
        Select all premium features present in your vehicle. Each feature can significantly impact your vehicle's valuation.
      </p>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex gap-1 mb-4 w-full bg-slate-100 p-1 overflow-x-auto no-scrollbar">
          <TabsTrigger value="all" className="data-[state=active]:bg-white flex-1">
            All Features
          </TabsTrigger>
          
          {categories.map((category) => (
            <TabsTrigger 
              key={category.name} 
              value={category.name}
              className="data-[state=active]:bg-white flex-1 whitespace-nowrap"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="p-4 border border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                  {category.name}
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  {category.features.map((feature) => (
                    <FeatureTag
                      key={feature.id}
                      feature={feature}
                      isSelected={selectedFeatures.includes(feature.id)}
                      onClick={() => toggleFeature(feature.id)}
                      disabled={disabled}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {categories.map((category) => (
          <TabsContent 
            key={category.name}
            value={category.name}
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {category.features.map((feature) => (
                <FeatureTag
                  key={feature.id}
                  feature={feature}
                  isSelected={selectedFeatures.includes(feature.id)}
                  onClick={() => toggleFeature(feature.id)}
                  disabled={disabled}
                  isLarge
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {selectedFeatures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Value Added by Features</h4>
            </div>
            <span className="text-lg font-semibold text-green-700">+${totalAddedValue}</span>
          </div>
          <p className="mt-2 text-sm text-green-700">
            The selected premium features add significant value to your vehicle's appraisal.
          </p>
        </motion.div>
      )}
    </div>
  );
}

interface FeatureTagProps {
  feature: Feature;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  isLarge?: boolean;
}

function FeatureTag({ feature, isSelected, onClick, disabled = false, isLarge = false }: FeatureTagProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={disabled ? undefined : onClick}
            className={`
              ${isLarge ? 'p-3 h-full' : 'py-1 px-2.5'} 
              rounded-lg border cursor-pointer transition-all flex items-center
              ${isSelected 
                ? 'bg-primary text-white border-primary/50' 
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
              }
              ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {isSelected && <CheckCircle className={`${isLarge ? 'mr-2 h-4 w-4' : 'mr-1.5 h-3 w-3'}`} />}
            
            <div className={`flex flex-col ${isLarge ? 'gap-1' : ''}`}>
              <span className={`${isLarge ? 'text-sm font-medium' : 'text-xs'}`}>
                {feature.name}
              </span>
              
              {isLarge && (
                <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-green-600'}`}>
                  +${feature.value_impact}
                </span>
              )}
              
              {!isLarge && (
                <span className={`ml-1.5 text-xs ${isSelected ? 'text-white/80' : 'text-green-600'}`}>
                  +${feature.value_impact}
                </span>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 max-w-xs">
          <div className="space-y-2">
            <p className="font-medium text-sm">{feature.name}</p>
            {feature.description && <p className="text-xs">{feature.description}</p>}
            <div className="flex items-center text-xs font-medium text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>Adds ${feature.value_impact} to your vehicle value</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Add the missing ArrowUp icon definition from lucide-react
function ArrowUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}
