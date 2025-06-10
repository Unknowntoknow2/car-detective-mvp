import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/premium-valuation";

interface FeatureSelectionStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function FeatureSelectionStep({
  formData,
  setFormData,
}: FeatureSelectionStepProps) {
  const selectedFeatures = formData.selectedFeatures || [];
  const packageLevel = formData.packageLevel || "basic";

  const features = [
    "Navigation System",
    "Leather Seats",
    "Sunroof/Moonroof",
    "Premium Sound System",
    "Heated Seats",
    "Backup Camera",
    "Blind Spot Monitoring",
    "Keyless Entry",
    "Remote Start",
    "Apple CarPlay/Android Auto",
  ];

  const packages = [
    { name: "Basic", features: [] },
    {
      name: "Premium",
      features: [
        "Navigation System",
        "Leather Seats",
        "Sunroof/Moonroof",
      ],
    },
    {
      name: "Ultimate",
      features: [
        "Navigation System",
        "Leather Seats",
        "Sunroof/Moonroof",
        "Premium Sound System",
        "Heated Seats",
      ],
    },
  ];

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];

    setFormData((prev: FormData) => ({
      ...prev,
      selectedFeatures: newFeatures
    }));
  };

  const handlePackageSelect = (newPackage: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      packageLevel: newPackage
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Vehicle Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Available Features</h3>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/40 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer hover:bg-primary/20"
                onClick={() => handleFeatureToggle(feature)}
              >
                <span>{feature}</span>
                <button
                  type="button"
                  className="ml-1 text-xs hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureToggle(feature);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Select Package</h3>
          <div className="flex gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`p-4 border rounded-md cursor-pointer ${
                  packageLevel === pkg.name ? "border-primary" : ""
                }`}
                onClick={() => handlePackageSelect(pkg.name)}
              >
                <h4 className="text-md font-semibold">{pkg.name}</h4>
                <ul className="list-disc pl-4 text-sm">
                  {pkg.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
