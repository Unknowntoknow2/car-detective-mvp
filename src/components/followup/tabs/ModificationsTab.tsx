
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Zap, Music, Palette, Wheel, Sofa, Wrench, Plus } from 'lucide-react';
import { FollowUpAnswers, ModificationDetails } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

interface Modification {
  label: string;
  value: string;
  impact: string;
}

interface ModificationGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Modification[];
}

const MODIFICATIONS: ModificationGroup[] = [
  {
    title: "Performance Mods",
    icon: Zap,
    items: [
      { label: "Cold Air Intake", value: "cold_air_intake", impact: "±$150" },
      { label: "Turbo Upgrade", value: "turbo_upgrade", impact: "±$400" },
      { label: "ECU Tuning", value: "ecu_tuning", impact: "±$300" },
      { label: "Exhaust System", value: "exhaust_system", impact: "±$250" },
      { label: "Nitrous Kit", value: "nitrous_kit", impact: "±$500" },
      { label: "Supercharger", value: "supercharger", impact: "±$600" },
    ],
  },
  {
    title: "Audio Mods",
    icon: Music,
    items: [
      { label: "Aftermarket Head Unit", value: "head_unit", impact: "+$100" },
      { label: "Subwoofer System", value: "subwoofer", impact: "+$150" },
      { label: "Amplifier", value: "amplifier", impact: "+$120" },
      { label: "Premium Speakers", value: "premium_speakers", impact: "+$200" },
      { label: "Sound Dampening", value: "sound_dampening", impact: "+$80" },
    ],
  },
  {
    title: "Aesthetic Mods",
    icon: Palette,
    items: [
      { label: "Custom Paint", value: "custom_paint", impact: "±$500" },
      { label: "Tinted Windows", value: "window_tint", impact: "+$100" },
      { label: "Body Kit", value: "body_kit", impact: "±$300" },
      { label: "Vinyl Wrap", value: "vinyl_wrap", impact: "±$400" },
      { label: "LED Underglow", value: "underglow", impact: "±$100" },
      { label: "Custom Graphics", value: "custom_graphics", impact: "±$200" },
    ],
  },
  {
    title: "Wheels & Tires",
    icon: Wheel,
    items: [
      { label: "Aftermarket Rims", value: "rims", impact: "+$250" },
      { label: "Low-Profile Tires", value: "low_profile_tires", impact: "±$150" },
      { label: "Lift Kit", value: "lift_kit", impact: "±$300" },
      { label: "Lowering Kit", value: "lowering_kit", impact: "±$200" },
      { label: "Custom Wheel Spacers", value: "wheel_spacers", impact: "±$50" },
    ],
  },
  {
    title: "Suspension Mods",
    icon: Wrench,
    items: [
      { label: "Coilovers", value: "coilovers", impact: "±$300" },
      { label: "Air Suspension", value: "air_suspension", impact: "±$500" },
      { label: "Strut Bars", value: "strut_bars", impact: "+$100" },
      { label: "Sway Bars", value: "sway_bars", impact: "+$150" },
      { label: "Performance Shocks", value: "performance_shocks", impact: "+$200" },
    ],
  },
  {
    title: "Interior Mods",
    icon: Sofa,
    items: [
      { label: "Racing Seats", value: "racing_seats", impact: "±$200" },
      { label: "Custom Steering Wheel", value: "steering_wheel", impact: "±$150" },
      { label: "LED Cabin Lights", value: "led_lights", impact: "+$50" },
      { label: "Custom Floor Mats", value: "custom_floor_mats", impact: "+$75" },
      { label: "Shift Knob", value: "shift_knob", impact: "+$40" },
      { label: "Gauge Cluster", value: "gauge_cluster", impact: "±$200" },
    ],
  },
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const modificationData = formData.modifications || {
    hasModifications: false,
    modified: false,
    types: []
  };

  const handleModificationToggle = (checked: boolean) => {
    const updated = {
      ...modificationData,
      hasModifications: checked,
      modified: checked,
      ...(checked ? {} : { types: [], description: '' })
    };
    updateFormData({ modifications: updated });
  };

  const toggleMod = (value: string) => {
    const currentTypes = modificationData.types || [];
    const updated = currentTypes.includes(value)
      ? currentTypes.filter((v: string) => v !== value)
      : [...currentTypes, value];
    
    updateFormData({ 
      modifications: {
        ...modificationData,
        types: updated
      }
    });
  };

  const handleDescriptionChange = (description: string) => {
    updateFormData({
      modifications: {
        ...modificationData,
        description
      }
    });
  };

  const selectedCount = modificationData.types?.length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            Vehicle Modifications
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Have you made any modifications to this vehicle? Some mods can increase value while others may decrease it.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Toggle */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Switch
              id="has-modifications"
              checked={modificationData.hasModifications}
              onCheckedChange={handleModificationToggle}
            />
            <Label htmlFor="has-modifications" className="text-base font-medium">
              This vehicle has been modified
            </Label>
          </div>

          {/* Modification Categories */}
          {modificationData.hasModifications && (
            <div className="space-y-4">
              {MODIFICATIONS.map((group) => {
                const Icon = group.icon;
                const groupSelectedCount = group.items.filter(item => 
                  modificationData.types?.includes(item.value)
                ).length;

                return (
                  <div key={group.title} className="border rounded-lg">
                    <div className="p-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <h3 className="text-md font-semibold">{group.title}</h3>
                        </div>
                        {groupSelectedCount > 0 && (
                          <Badge variant="secondary">
                            {groupSelectedCount} selected
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {group.items.map((mod) => (
                          <div key={mod.value} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={modificationData.types?.includes(mod.value) || false}
                                onCheckedChange={() => toggleMod(mod.value)}
                              />
                              <span className="font-medium">{mod.label}</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={mod.impact.startsWith('+') ? 'text-green-600 border-green-600' : 'text-orange-600 border-orange-600'}
                            >
                              {mod.impact}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Modification Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-details"
                    checked={showDetails}
                    onCheckedChange={setShowDetails}
                  />
                  <Label htmlFor="show-details">Add modification details</Label>
                </div>

                {showDetails && (
                  <div>
                    <Label htmlFor="modification-details" className="text-sm font-medium">
                      Modification Details
                    </Label>
                    <Textarea
                      id="modification-details"
                      value={modificationData.description || ""}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="Provide details about your modifications (brand, installer, year, cost, etc.)"
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedCount > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-orange-800">
                      Total Modifications Selected:
                    </span>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      {selectedCount} modification{selectedCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-sm text-orange-700 mt-2">
                    <strong>⚠️ Valuation Impact:</strong> Performance mods may reduce value unless professionally installed. 
                    Quality upgrades and professional installation typically preserve or increase value.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
