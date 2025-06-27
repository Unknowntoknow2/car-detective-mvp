
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Zap, Palette, Car, Shield, AlertTriangle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const modificationCategories = [
  {
    category: 'Performance',
    icon: Zap,
    color: 'text-red-600',
    impact: 'Variable impact',
    items: [
      { value: 'cold_air_intake', label: 'Cold air intake' },
      { value: 'exhaust_upgrade', label: 'Exhaust system upgrade' },
      { value: 'turbo_supercharger', label: 'Turbo/Supercharger' },
      { value: 'engine_tune', label: 'Engine tune/ECU remap' },
      { value: 'suspension_mods', label: 'Suspension modifications' },
      { value: 'brake_upgrades', label: 'Brake upgrades' },
      { value: 'transmission_mods', label: 'Transmission modifications' }
    ]
  },
  {
    category: 'Exterior',
    icon: Car,
    color: 'text-blue-600',
    impact: 'Often decreases value',
    items: [
      { value: 'custom_paint', label: 'Custom paint/wrap' },
      { value: 'body_kit', label: 'Body kit' },
      { value: 'spoiler_wing', label: 'Spoiler/Wing' },
      { value: 'custom_wheels', label: 'Custom wheels/Rims' },
      { value: 'lowered_raised', label: 'Lowered/Raised suspension' },
      { value: 'tinted_windows', label: 'Tinted windows' },
      { value: 'custom_lighting', label: 'Custom lighting' }
    ]
  },
  {
    category: 'Interior',
    icon: Palette,
    color: 'text-purple-600',
    impact: 'Mixed impact',
    items: [
      { value: 'custom_upholstery', label: 'Custom upholstery' },
      { value: 'aftermarket_stereo', label: 'Aftermarket stereo/Audio' },
      { value: 'racing_seats', label: 'Racing seats' },
      { value: 'custom_dashboard', label: 'Custom dashboard' },
      { value: 'steering_wheel', label: 'Steering wheel upgrade' },
      { value: 'interior_lighting', label: 'Interior lighting' },
      { value: 'gauge_cluster', label: 'Gauge cluster modifications' }
    ]
  },
  {
    category: 'Safety/Security',
    icon: Shield,
    color: 'text-green-600',
    impact: 'Often increases value',
    items: [
      { value: 'alarm_upgrade', label: 'Alarm system upgrade' },
      { value: 'gps_tracking', label: 'GPS tracking' },
      { value: 'dash_camera', label: 'Dash camera' },
      { value: 'roll_cage', label: 'Roll cage' },
      { value: 'racing_harness', label: 'Racing harnesses' },
      { value: 'fire_suppression', label: 'Fire suppression system' }
    ]
  }
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const hasModifications = formData.modifications?.hasModifications || false;

  const handleModificationChange = (value: string) => {
    const hasModifications = value === 'yes';
    updateFormData({
      modifications: {
        hasModifications,
        modified: hasModifications,
        types: hasModifications ? (formData.modifications?.types || []) : [],
        reversible: hasModifications ? (formData.modifications?.reversible || false) : false,
        description: hasModifications ? (formData.modifications?.description || '') : '',
        additionalNotes: hasModifications ? (formData.modifications?.additionalNotes || '') : ''
      }
    });
  };

  const handleModificationTypeChange = (type: string, checked: boolean) => {
    const currentTypes = formData.modifications?.types || [];
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    updateFormData({
      modifications: {
        ...formData.modifications,
        types: updatedTypes,
        hasModifications: formData.modifications?.hasModifications || false,
        modified: formData.modifications?.modified || false,
        reversible: formData.modifications?.reversible || false,
        description: formData.modifications?.description || '',
        additionalNotes: formData.modifications?.additionalNotes || ''
      }
    });
  };

  const handleModificationDetailChange = (field: string, value: any) => {
    updateFormData({
      modifications: {
        ...formData.modifications,
        hasModifications: formData.modifications?.hasModifications || false,
        modified: formData.modifications?.modified || false,
        types: formData.modifications?.types || [],
        reversible: formData.modifications?.reversible || false,
        description: formData.modifications?.description || '',
        additionalNotes: formData.modifications?.additionalNotes || '',
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Modification Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Vehicle Modifications
          </CardTitle>
          <p className="text-sm text-gray-600">
            Has this vehicle been modified from its original factory condition?
          </p>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={hasModifications ? 'yes' : 'no'}
            onValueChange={handleModificationChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="no" id="modifications-no" />
              <Label htmlFor="modifications-no" className="cursor-pointer">
                <div>
                  <div className="font-medium">No modifications</div>
                  <div className="text-sm text-gray-500">Factory original condition</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="yes" id="modifications-yes" />
              <Label htmlFor="modifications-yes" className="cursor-pointer">
                <div>
                  <div className="font-medium">Yes, has modifications</div>
                  <div className="text-sm text-gray-500">Select types below</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Modification Types */}
      {hasModifications && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Types of Modifications</CardTitle>
              <p className="text-sm text-gray-600">
                Select all modifications that have been made to this vehicle
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {modificationCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-5 h-5 ${category.color}`} />
                      <h3 className={`font-medium ${category.color}`}>
                        {category.category}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {category.impact}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-7">
                      {category.items.map((item) => (
                        <div key={item.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.value}
                            checked={formData.modifications?.types?.includes(item.value) || false}
                            onCheckedChange={(checked) => handleModificationTypeChange(item.value, checked as boolean)}
                          />
                          <Label htmlFor={item.value} className="cursor-pointer text-sm">
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modification Details</CardTitle>
              <p className="text-sm text-gray-600">
                Provide additional information about the modifications
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Include details such as: brand names, installation quality, professional vs DIY, costs, performance gains, warranty status, reversibility, etc."
                value={formData.modifications?.additionalNotes || ''}
                onChange={(e) => handleModificationDetailChange('additionalNotes', e.target.value)}
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Modification Impact Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-orange-700 space-y-2">
                <p className="font-medium">Important: Vehicle modifications can significantly impact valuation:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Performance modifications may reduce resale appeal</li>
                  <li>Quality of installation affects value impact</li>
                  <li>Original parts retention is important</li>
                  <li>Professional installation vs DIY affects valuation</li>
                  <li>Some modifications may void warranties</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
