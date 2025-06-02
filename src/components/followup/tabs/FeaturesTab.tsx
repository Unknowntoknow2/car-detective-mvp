
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { calculateEnhancedFeatureValue } from '@/utils/enhanced-features-calculator';

// Import feature category components
import {
  TechnologyTab,
  SafetySecurityTab,
  ClimateControlTab,
  AudioEntertainmentTab,
  InteriorMaterialsTab,
  ExteriorFeaturesTab,
  LuxuryMaterialsTab,
  DriverAssistanceTab,
  PerformancePackagesTab,
} from './';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  baseValue: number;
}

export function FeaturesTab({ formData, updateFormData, baseValue }: FeaturesTabProps) {
  const [activeCategory, setActiveCategory] = useState('technology');

  // Feature categories configuration
  const featureCategories = [
    { id: 'technology', label: '📱 Technology', component: TechnologyTab },
    { id: 'safety', label: '🛡️ Safety & Security', component: SafetySecurityTab },
    { id: 'climate', label: '❄️ Climate Control', component: ClimateControlTab },
    { id: 'audio', label: '🎵 Audio & Entertainment', component: AudioEntertainmentTab },
    { id: 'interior', label: '🪑 Interior Materials', component: InteriorMaterialsTab },
    { id: 'exterior', label: '🚪 Exterior Features', component: ExteriorFeaturesTab },
    { id: 'luxury', label: '💎 Luxury Materials', component: LuxuryMaterialsTab },
    { id: 'adas', label: '🤖 Driver Assistance', component: DriverAssistanceTab },
    { id: 'performance', label: '🏎️ Performance Packages', component: PerformancePackagesTab }
  ];

  // Calculate total feature value
  const totalFeatureValue = calculateEnhancedFeatureValue(formData.features || [], baseValue);

  return (
    <div className="space-y-6">
      {/* Features Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              Vehicle Features
            </CardTitle>
            {totalFeatureValue.totalAdjustment > 0 && (
              <Badge variant="secondary" className="text-green-600">
                +${totalFeatureValue.totalAdjustment.toLocaleString()} Value Added
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select the features your vehicle has. Each feature may impact the vehicle's value based on market demand and rarity.
          </p>
          
          {formData.features && formData.features.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>{formData.features.length} features selected</strong> - 
                These premium features can increase your vehicle's market value.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-1 h-auto p-1">
          {featureCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-xs p-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {featureCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <category.component
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
