import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings, Zap, Volume2, Palette, Car } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const MODIFICATION_CATEGORIES = [
  {
    name: 'Performance',
    icon: Zap,
    color: 'text-red-500',
    modifications: [
      { id: 'cold_air_intake', name: 'Cold Air Intake', impact: 150 },
      { id: 'turbo_upgrade', name: 'Turbo/Supercharger', impact: 800 },
      { id: 'exhaust_system', name: 'Performance Exhaust', impact: 300 },
      { id: 'ecu_tune', name: 'ECU Tune/Chip', impact: 400 },
      { id: 'suspension_upgrade', name: 'Performance Suspension', impact: 500 }
    ]
  },
  {
    name: 'Audio & Electronics',
    icon: Volume2,
    color: 'text-blue-500',
    modifications: [
      { id: 'premium_sound', name: 'Premium Sound System', impact: 400 },
      { id: 'subwoofer', name: 'Subwoofer', impact: 200 },
      { id: 'amplifier', name: 'Amplifier', impact: 150 },
      { id: 'aftermarket_head_unit', name: 'Aftermarket Head Unit', impact: 250 }
    ]
  },
  {
    name: 'Appearance',
    icon: Palette,
    color: 'text-purple-500',
    modifications: [
      { id: 'custom_paint', name: 'Custom Paint Job', impact: -200 },
      { id: 'window_tint', name: 'Window Tinting', impact: 100 },
      { id: 'body_kit', name: 'Body Kit', impact: -300 },
      { id: 'custom_wheels', name: 'Custom Wheels', impact: 200 }
    ]
  },
  {
    name: 'Interior',
    icon: Settings,
    color: 'text-green-500',
    modifications: [
      { id: 'seat_covers', name: 'Custom Seat Covers', impact: 50 },
      { id: 'racing_seats', name: 'Racing Seats', impact: 100 },
      { id: 'steering_wheel', name: 'Aftermarket Steering Wheel', impact: -50 },
      { id: 'shift_knob', name: 'Custom Shift Knob', impact: 25 }
    ]
  }
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const hasModifications = formData.modifications?.hasModifications || false;
  const selectedTypes = formData.modifications?.types || [];

  const handleToggleModifications = (checked: boolean) => {
    updateFormData({
      modifications: {
        ...formData.modifications,
        hasModifications: checked,
        types: checked ? selectedTypes : []
      }
    });
  };

  const handleModificationToggle = (modId: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...selectedTypes, modId]
      : selectedTypes.filter(id => id !== modId);
    
    updateFormData({
      modifications: {
        ...formData.modifications,
        hasModifications: updatedTypes.length > 0,
        types: updatedTypes
      }
    });
  };

  const calculateTotalImpact = () => {
    return MODIFICATION_CATEGORIES.reduce((total, category) => {
      return total + category.modifications.reduce((catTotal, mod) => {
        return selectedTypes.includes(mod.id) ? catTotal + mod.impact : catTotal;
      }, 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            Vehicle Modifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="has-modifications" className="text-base font-medium">
              Does your vehicle have any modifications?
            </Label>
            <Switch
              id="has-modifications"
              checked={hasModifications}
              onCheckedChange={handleToggleModifications}
            />
          </div>

          {hasModifications && (
            <div className="space-y-4 mt-6">
              {MODIFICATION_CATEGORIES.map((category) => (
                <Collapsible key={category.name} defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <category.icon className={`h-5 w-5 ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 p-3 border rounded-lg bg-white">
                    <div className="grid grid-cols-1 gap-3">
                      {category.modifications.map((mod) => (
                        <div key={mod.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={mod.id}
                              checked={selectedTypes.includes(mod.id)}
                              onCheckedChange={(checked) => handleModificationToggle(mod.id, !!checked)}
                            />
                            <Label htmlFor={mod.id} className="cursor-pointer">
                              {mod.name}
                            </Label>
                          </div>
                          <span className={`text-sm font-medium ${mod.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {mod.impact >= 0 ? '+' : ''}${mod.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800">Total Modification Impact:</span>
                  <span className={`font-semibold text-lg ${calculateTotalImpact() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateTotalImpact() >= 0 ? '+' : ''}${calculateTotalImpact()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Performance modifications may reduce value if not professionally installed. 
                  Some modifications may void warranties or affect insurance coverage.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
