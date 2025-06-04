<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
=======
import React, { useEffect, useState } from "react";
import { DesignCard } from "@/components/ui/design-system";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";

interface Feature {
  id: string;
  name: string;
  category: string;
  value_impact: number;
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface FeaturesSelectorProps {
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
}

const featureCategories = {
  Safety: ['ABS', 'Airbags', 'Backup Camera', 'Blind Spot Monitor'],
  Technology: ['Bluetooth', 'Navigation System', 'Premium Sound System', 'Remote Start'],
  Comfort: ['Leather Seats', 'Heated Seats', 'Sunroof', 'Keyless Entry'],
  Other: ['Alloy Wheels', 'Third-Row Seating', 'Four-Wheel Drive', 'Tow Package'],
};

export const FeaturesSelector: React.FC<FeaturesSelectorProps> = ({
  selectedFeatures,
  onFeatureToggle,
}) => {
<<<<<<< HEAD
  return (
    <div className="space-y-6">
      {Object.entries(featureCategories).map(([category, features]) => (
        <Card 
          key={category}
          className="p-4 space-y-4"
        >
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFeatureToggle(feature);
                    } else {
                      onFeatureToggle(feature);
                    }
                  }}
                />
                <Label htmlFor={feature} className="cursor-pointer">
                  {feature}
                </Label>
=======
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("features")
          .select("*")
          .order("category")
          .order("name");

        if (error) {
          throw new Error(error.message);
        }

        setFeatures(data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load premium features",
        );
        console.error("Error fetching features:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const handleFeatureToggle = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      onFeaturesChange(selectedFeatures.filter((id) => id !== featureId));
    } else {
      onFeaturesChange([...selectedFeatures, featureId]);
    }
  };

  // Group features by category
  const featuresByCategory = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-error/30 bg-error-light/20 rounded-lg">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Premium Features
        </h3>
        {selectedFeatures.length > 0 && (
          <Badge variant="outline" className="bg-primary-light/30 gap-1">
            {selectedFeatures.length} selected
          </Badge>
        )}
      </div>

      <p className="text-sm text-text-secondary">
        Select all premium features that your vehicle has. These can
        significantly impact your vehicle's value.
      </p>

      <div className="grid gap-4">
        {Object.entries(featuresByCategory).map((
          [category, categoryFeatures],
        ) => (
          <DesignCard
            key={category}
            variant="outline"
            className="border-primary/10 bg-surface p-4"
          >
            <div className="space-y-4">
              <h4 className="text-md font-medium">{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-start space-x-2 hover:bg-primary-light/10 p-2 rounded-md transition-colors"
                  >
                    <Checkbox
                      id={feature.id}
                      disabled={disabled}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={feature.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {feature.name}
                      </Label>
                      <p className="text-xs text-text-secondary">
                        +{feature.value_impact}% value
                      </p>
                    </div>
                  </div>
                ))}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
