import React, { useEffect, useState } from "react";
import { FormData } from "@/types/premium-valuation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { SeasonalAdjustment } from "@/components/valuation/SeasonalAdjustment";

interface FeatureSelectionStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function FeatureSelectionStep({
  step,
  formData,
  setFormData,
  updateValidity,
}: FeatureSelectionStepProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    formData.features || [],
  );

  useEffect(() => {
    // Initialize selected features from form data
    setSelectedFeatures(formData.features || []);
  }, [formData.features]);

  useEffect(() => {
    // Update form data whenever selected features change
    setFormData((prev) => ({
      ...prev,
      features: selectedFeatures,
    }));

    // Validate if any features are selected
    const isValid = selectedFeatures.length > 0;
    updateValidity(step, isValid);
  }, [selectedFeatures, setFormData, step, updateValidity]);

  // Feature categories and their items
  const featureCategories = [
    {
      name: "Entertainment",
      items: [
        "Premium Sound System",
        "DVD Player",
        "Navigation System",
        "Bluetooth Connectivity",
      ],
    },
    {
      name: "Comfort & Convenience",
      items: [
        "Leather Seats",
        "Heated Seats",
        "Sunroof/Moonroof",
        "Keyless Entry",
        "Remote Start",
      ],
    },
    {
      name: "Safety & Security",
      items: [
        "Backup Camera",
        "Blind Spot Monitoring",
        "Lane Departure Warning",
        "Adaptive Cruise Control",
        "Parking Sensors",
      ],
    },
    {
      name: "Performance",
      items: [
        "All-Wheel Drive",
        "Turbocharged Engine",
        "Sport Suspension",
        "Performance Tires",
      ],
    },
  ];

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(feature)) {
        return prev.filter((f) => f !== feature);
      } else {
        return [...prev, feature];
      }
    });
  };

  // Handle seasonal adjustment changes
  const handleSeasonalChange = (
    values: { saleDate: Date | undefined; bodyStyle: string | undefined },
  ) => {
    setFormData((prev) => ({
      ...prev,
<<<<<<< HEAD
      // Convert Date to Date object explicitly to match the FormData type
      saleDate: values.saleDate ? new Date(values.saleDate) : undefined,
      bodyStyle: values.bodyStyle || undefined, // Use undefined if empty
      bodyType: values.bodyStyle || undefined  // Keep bodyType in sync with bodyStyle
=======
      saleDate: values.saleDate,
      bodyStyle: values.bodyStyle, // Using bodyStyle as defined in FormData interface
      bodyType: values.bodyStyle, // Also set bodyType for compatibility
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Features & Market Factors
        </h2>
        <p className="text-gray-600 mb-6">
          Select features that apply to your vehicle and provide market timing
          information.
        </p>
      </div>

      {/* Seasonal Adjustment Card */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Seasonal Market Timing</h3>
          <p className="text-sm text-gray-500 mb-4">
            Vehicle values fluctuate based on season and body style. For
            example, convertibles are more valuable in summer.
          </p>

          <SeasonalAdjustment
            onChange={handleSeasonalChange}
            defaultDate={formData.saleDate || new Date()}
            defaultBodyStyle={formData.bodyStyle || formData.bodyType}
          />
        </CardContent>
      </Card>

      {/* Feature Selection Cards */}
      {featureCategories.map((category) => (
        <Card key={category.name}>
          <CardContent className="space-y-3">
            <h3 className="text-lg font-medium">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.items.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={selectedFeatures.includes(item)}
                    onCheckedChange={() =>
                      handleFeatureChange(item)}
                  />
                  <Label htmlFor={item}>{item}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
