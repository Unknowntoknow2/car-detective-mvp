import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck, Search, BarChart3, FileText } from "lucide-react";

interface FeatureCategory {
  name: string;
  icon: JSX.Element;
  features: Feature[];
}

interface Feature {
  id: string;
  name: string;
  description?: string;
  // Add any other properties that might be in the Feature type
}

export function ComprehensiveFeatureSelector() {
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  useEffect(() => {
    const properlyTypedFeatures: Feature[] = []; // Or whatever the actual features are
    setCategories([
      { 
        name: 'Valuation Insights', 
        icon: <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />, 
        features: [
          { id: 'ai_condition', name: 'AI-Powered Condition Analysis', description: 'Get an accurate assessment of your vehicle\'s condition using advanced AI.' },
          { id: 'market_trends', name: 'Real-Time Market Trends', description: 'Understand current market conditions affecting your vehicle\'s value.' },
          { id: 'regional_pricing', name: 'Regional Pricing Data', description: 'See how prices vary in your local area.' },
        ]
      },
      { 
        name: 'Safety & Reliability', 
        icon: <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />, 
        features: [
          { id: 'accident_history', name: 'Accident History Report', description: 'Check for any reported accidents or damage.' },
          { id: 'recall_check', name: 'Open Recall Check', description: 'Ensure your vehicle is free from safety recalls.' },
          { id: 'maintenance_records', name: 'Detailed Maintenance Records', description: 'View service history and maintenance schedules.' },
        ]
      },
      {
        name: 'Market Comparison',
        icon: <Search className="h-4 w-4 mr-2 text-blue-500" />,
        features: [
          { id: 'comparable_listings', name: 'Comparable Listings Analysis', description: 'Compare your vehicle to similar listings in the market.' },
          { id: 'price_comparison', name: 'Price Comparison Tool', description: 'See how your vehicle\'s price stacks up against the competition.' },
          { id: 'days_on_market', name: 'Average Days on Market', description: 'Understand how quickly similar vehicles are selling.' },
        ]
      },
      {
        name: 'Value Analytics',
        icon: <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />,
        features: [
          { id: 'depreciation_analysis', name: 'Depreciation Analysis', description: 'Project your vehicle\'s future value based on historical data.' },
          { id: 'mileage_impact', name: 'Mileage Impact Assessment', description: 'See how mileage affects your vehicle\'s value.' },
          { id: 'condition_adjustment', name: 'Condition Adjustment Tool', description: 'Adjust the valuation based on your vehicle\'s specific condition.' },
        ]
      },
      {
        name: 'Comprehensive Reporting',
        icon: <FileText className="h-4 w-4 mr-2 text-gray-500" />,
        features: [
          { id: 'full_valuation_report', name: 'Full Valuation Report', description: 'Download a detailed report with all valuation data.' },
          { id: 'market_analysis_report', name: 'Market Analysis Report', description: 'Get a comprehensive overview of the current market conditions.' },
          { id: 'customizable_report', name: 'Customizable Report Options', description: 'Tailor the report to your specific needs and preferences.' },
        ]
      }
    ]);
  }, []);
  
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };
  
  const isFeatureSelected = (featureId: string) => selectedFeatures.includes(featureId);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unlock Premium Features</CardTitle>
        <CardDescription>Select the features that matter most to you</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] w-full rounded-md border">
          <div className="p-4">
            {categories.map((category, index) => (
              <div key={index} className="mb-6">
                <div className="flex items-center mb-2">
                  {category.icon}
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
                {category.features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={feature.id}
                        checked={isFeatureSelected(feature.id)}
                        onCheckedChange={() => toggleFeature(feature.id)}
                      />
                      <label
                        htmlFor={feature.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {feature.name}
                      </label>
                    </div>
                    {isFeatureSelected(feature.id) && (
                      <Badge variant="secondary">Selected</Badge>
                    )}
                  </div>
                ))}
                {index < categories.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
