
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TechnologyTab } from './TechnologyTab';
import { SafetySecurityTab } from './SafetySecurityTab';
import { ClimateControlTab } from './ClimateControlTab';
import { AudioEntertainmentTab } from './AudioEntertainmentTab';
import { InteriorMaterialsTab } from './InteriorMaterialsTab';
import { ExteriorFeaturesTab } from './ExteriorFeaturesTab';
import { LuxuryMaterialsTab } from './LuxuryMaterialsTab';
import { DriverAssistanceTab } from './DriverAssistanceTab';
import { calculateEnhancedFeatureValue } from '@/utils/enhanced-features-calculator';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  baseValue?: number;
  overrideDetected?: boolean;
}

export function FeaturesTab({ 
  formData, 
  updateFormData, 
  baseValue = 25000,
  overrideDetected = false 
}: FeaturesTabProps) {
  const selectedFeatures = formData.features || [];
  const totalValue = calculateEnhancedFeatureValue(selectedFeatures, baseValue);

  const featureCategories = [
    { id: 'technology', label: '📱 Technology', component: TechnologyTab },
    { id: 'safety', label: '🛡️ Safety & Security', component: SafetySecurityTab },
    { id: 'climate', label: '❄️ Climate Control', component: ClimateControlTab },
    { id: 'audio', label: '🎵 Audio & Entertainment', component: AudioEntertainmentTab },
    { id: 'interior', label: '🪑 Interior Materials', component: InteriorMaterialsTab },
    { id: 'exterior', label: '🚪 Exterior Features', component: ExteriorFeaturesTab },
    { id: 'luxury', label: '💎 Luxury Materials', component: LuxuryMaterialsTab },
    { id: 'adas', label: '🤖 Driver Assistance', component: DriverAssistanceTab }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Vehicle Features Selection</h3>
          {totalValue.totalAdjustment > 0 && (
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Total Value: +${totalValue.totalAdjustment.toLocaleString()}
            </Badge>
          )}
        </div>
        <p className="text-gray-600">
          Select all features that are present in your vehicle. Each feature adds value to your vehicle's overall worth.
        </p>
        {overrideDetected && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              ⚠️ Manual override detected. Feature adjustments may be limited.
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="technology" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1">
              {featureCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 p-3 text-xs"
                >
                  <span className="text-sm">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              {featureCategories.map((category) => {
                const CategoryComponent = category.component;
                return (
                  <TabsContent key={category.id} value={category.id}>
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
        </CardContent>
      </Card>

      {selectedFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Features Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Selected Features:</span>
                <span>{selectedFeatures.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Percentage Adjustment:</span>
                <span className="text-green-600">
                  +{(totalValue.percentageAdjustment / baseValue * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Fixed Value Addition:</span>
                <span className="text-green-600">
                  +${totalValue.fixedAdjustment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center font-semibold pt-2 border-t">
                <span>Total Value Addition:</span>
                <span className="text-green-600 text-lg">
                  +${totalValue.totalAdjustment.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
