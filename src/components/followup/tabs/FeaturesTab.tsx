import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FollowUpAnswers, FeatureOption } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const FEATURE_CATEGORIES = [
  {
    title: "Safety & Driver Assistance",
    color: "border-red-500",
    features: [
      { id: "blind_spot_monitor", label: "Blind Spot Monitor", impact: 400, category: "safety" },
      { id: "adaptive_cruise_control", label: "Adaptive Cruise Control", impact: 600, category: "safety" },
      { id: "lane_keep_assist", label: "Lane Keep Assist", impact: 350, category: "safety" },
      { id: "rear_cross_traffic", label: "Rear Cross Traffic Alert", impact: 300, category: "safety" },
      { id: "auto_emergency_braking", label: "Auto Emergency Braking", impact: 500, category: "safety" },
      { id: "backup_camera", label: "Backup Camera", impact: 250, category: "safety" },
      { id: "parking_sensors", label: "Parking Sensors", impact: 200, category: "safety" },
      { id: "collision_warning", label: "Collision Warning", impact: 400, category: "safety" },
      { id: "stability_control", label: "Stability Control", impact: 300, category: "safety" },
      { id: "auto_high_beams", label: "Auto High Beams", impact: 150, category: "safety" },
    ],
  },
  {
    title: "Tech & Connectivity",
    color: "border-blue-500",
    features: [
      { id: "apple_carplay", label: "Apple CarPlay", impact: 400, category: "tech" },
      { id: "android_auto", label: "Android Auto", impact: 400, category: "tech" },
      { id: "navigation_system", label: "Navigation System", impact: 500, category: "tech" },
      { id: "touchscreen", label: "Touchscreen Display", impact: 350, category: "tech" },
      { id: "bluetooth", label: "Bluetooth", impact: 200, category: "tech" },
      { id: "usb_ports", label: "USB Ports", impact: 150, category: "tech" },
      { id: "wifi_hotspot", label: "Wi-Fi Hotspot", impact: 300, category: "tech" },
      { id: "wireless_charging", label: "Wireless Charging", impact: 250, category: "tech" },
      { id: "voice_control", label: "Voice Control", impact: 200, category: "tech" },
    ],
  },
  {
    title: "Comfort & Convenience",
    color: "border-green-500",
    features: [
      { id: "leather_seats", label: "Leather Seats", impact: 800, category: "comfort" },
      { id: "heated_seats", label: "Heated Seats", impact: 600, category: "comfort" },
      { id: "ventilated_seats", label: "Ventilated Seats", impact: 700, category: "comfort" },
      { id: "power_seats", label: "Power Seats", impact: 400, category: "comfort" },
      { id: "memory_seats", label: "Memory Seats", impact: 500, category: "comfort" },
      { id: "sunroof", label: "Sunroof/Moonroof", impact: 800, category: "comfort" },
      { id: "dual_zone_climate", label: "Dual Zone Climate", impact: 400, category: "comfort" },
      { id: "remote_start", label: "Remote Start", impact: 300, category: "comfort" },
      { id: "keyless_entry", label: "Keyless Entry", impact: 250, category: "comfort" },
      { id: "power_liftgate", label: "Power Liftgate", impact: 500, category: "comfort" },
      { id: "auto_wipers", label: "Auto Wipers", impact: 150, category: "comfort" },
    ],
  },
  {
    title: "Wheels & Tires",
    color: "border-purple-500",
    features: [
      { id: "alloy_wheels", label: "Alloy Wheels", impact: 400, category: "wheels" },
      { id: "premium_wheels", label: "Premium Wheels", impact: 800, category: "wheels" },
      { id: "low_profile_tires", label: "Low Profile Tires", impact: 300, category: "wheels" },
      { id: "run_flat_tires", label: "Run Flat Tires", impact: 200, category: "wheels" },
      { id: "spare_tire", label: "Full Size Spare", impact: 150, category: "wheels" },
      { id: "tire_pressure_monitor", label: "TPMS", impact: 100, category: "wheels" },
    ],
  },
  {
    title: "Utility & Performance",
    color: "border-orange-500",
    features: [
      { id: "all_wheel_drive", label: "All-Wheel Drive", impact: 1200, category: "performance" },
      { id: "four_wheel_drive", label: "4WD", impact: 1000, category: "performance" },
      { id: "tow_package", label: "Tow Package", impact: 600, category: "utility" },
      { id: "roof_rack", label: "Roof Rack", impact: 200, category: "utility" },
      { id: "bed_liner", label: "Bed Liner", impact: 300, category: "utility" },
      { id: "running_boards", label: "Running Boards", impact: 250, category: "utility" },
      { id: "tonneau_cover", label: "Tonneau Cover", impact: 400, category: "utility" },
      { id: "turbo_engine", label: "Turbocharged Engine", impact: 800, category: "performance" },
      { id: "sport_suspension", label: "Sport Suspension", impact: 500, category: "performance" },
    ],
  },
];

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const selectedFeatures = formData.features || [];

  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter((id) => id !== featureId)
      : [...selectedFeatures, featureId];

    updateFormData({ features: updatedFeatures });
  };

  return (
    <div className="space-y-6">
      {FEATURE_CATEGORIES.map((category) => (
        <Card key={category.title} className="border">
          <CardHeader className="py-2 px-3">
            <CardTitle className={`text-sm font-semibold ${category.color}`}>
              {category.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
            {category.features.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <Label htmlFor={feature.id} className="cursor-pointer text-sm">
                  {feature.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
