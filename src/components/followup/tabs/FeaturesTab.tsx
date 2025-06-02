
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Import all feature category components
import { TechnologyTab } from './TechnologyTab';
import { SafetySecurityTab } from './SafetySecurityTab';
import { ClimateControlTab } from './ClimateControlTab';
import { AudioEntertainmentTab } from './AudioEntertainmentTab';
import { InteriorMaterialsTab } from './InteriorMaterialsTab';
import { ExteriorFeaturesTab } from './ExteriorFeaturesTab';
import { LuxuryMaterialsTab } from './LuxuryMaterialsTab';
import { DriverAssistanceTab } from './DriverAssistanceTab';
import { PerformancePackagesTab } from './PerformancePackagesTab';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const FEATURE_CATEGORIES = [
  { id: 'technology', label: 'Technology', icon: '📱', component: TechnologyTab },
  { id: 'safety', label: 'Safety & Security', icon: '🛡️', component: SafetySecurityTab },
  { id: 'climate', label: 'Climate Control', icon: '❄️', component: ClimateControlTab },
  { id: 'audio', label: 'Audio & Entertainment', icon: '🎵', component: AudioEntertainmentTab },
  { id: 'interior', label: 'Interior Materials', icon: '🪑', component: InteriorMaterialsTab },
  { id: 'exterior', label: 'Exterior Features', icon: '🚪', component: ExteriorFeaturesTab },
  { id: 'luxury', label: 'Luxury Materials', icon: '💎', component: LuxuryMaterialsTab },
  { id: 'adas', label: 'Driver Assistance', icon: '🤖', component: DriverAssistanceTab },
  { id: 'performance', label: 'Performance Packages', icon: '🏎️', component: PerformancePackagesTab }
];

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const [activeCategory, setActiveCategory] = useState('technology');
  const selectedFeatures = formData.features || [];
  
  // Mock base value for feature calculations
  const baseValue = 25000;

  const getCategoryFeatureCount = (categoryId: string) => {
    // This would normally come from the feature calculator utility
    // For now, returning mock counts based on category
    const categoryFeatureCounts: Record<string, number> = {
      technology: selectedFeatures.filter(f => f.includes('tech') || f.includes('nav') || f.includes('bluetooth')).length,
      safety: selectedFeatures.filter(f => f.includes('safety') || f.includes('airbag') || f.includes('brake')).length,
      climate: selectedFeatures.filter(f => f.includes('climate') || f.includes('ac') || f.includes('heat')).length,
      audio: selectedFeatures.filter(f => f.includes('audio') || f.includes('speaker') || f.includes('sound')).length,
      interior: selectedFeatures.filter(f => f.includes('leather') || f.includes('seat') || f.includes('interior')).length,
      exterior: selectedFeatures.filter(f => f.includes('exterior') || f.includes('wheel') || f.includes('light')).length,
      luxury: selectedFeatures.filter(f => f.includes('luxury') || f.includes('premium') || f.includes('wood')).length,
      adas: selectedFeatures.filter(f => f.includes('assist') || f.includes('cruise') || f.includes('lane')).length,
      performance: selectedFeatures.filter(f => f.includes('performance') || f.includes('sport') || f.includes('turbo')).length
    };
    
    return categoryFeatureCounts[categoryId] || 0;
  };

  const totalFeaturesValue = selectedFeatures.length * 250; // Mock calculation

  return (
    <div className="space-y-6">
      {/* Features Overview */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center text-purple-800">
              <Star className="h-5 w-5 mr-2" />
              Vehicle Features & Options
            </div>
            {totalFeaturesValue > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +${totalFeaturesValue.toLocaleString()} Value
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-purple-700 mt-2">
            Select all features and options your vehicle has. Features can significantly impact your vehicle's value.
          </p>
        </CardHeader>
      </Card>

      {/* Feature Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-1 h-auto p-1 bg-gray-100">
          {FEATURE_CATEGORIES.map((category) => {
            const featureCount = getCategoryFeatureCount(category.id);
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center space-y-1 p-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">{category.label}</span>
                {featureCount > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-5">
                    {featureCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Category Content */}
        <div className="mt-6">
          {FEATURE_CATEGORIES.map((category) => {
            const CategoryComponent = category.component;
            return (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <CategoryComponent
                  formData={formData}
                  updateFormData={updateFormData}
                  baseValue={baseValue}
                />
              </TabsContent>
            );
          })}
        </div>
      </Tabs>

      {/* Summary */}
      {selectedFeatures.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800">Features Summary</h4>
                <p className="text-sm text-green-700">
                  {selectedFeatures.length} features selected across {FEATURE_CATEGORIES.filter(cat => getCategoryFeatureCount(cat.id) > 0).length} categories
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">+${totalFeaturesValue.toLocaleString()}</div>
                <div className="text-sm text-green-600">Estimated Value Add</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
