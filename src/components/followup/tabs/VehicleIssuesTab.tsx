
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface VehicleIssuesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function VehicleIssuesTab({ formData, updateFormData }: VehicleIssuesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Vehicle Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="smoking"
                checked={formData.smoking || false}
                onCheckedChange={(checked) => updateFormData({ smoking: !!checked })}
              />
              <Label htmlFor="smoking" className="cursor-pointer">
                Smoking odor or evidence of smoking
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="pet-damage"
                checked={formData.petDamage || false}
                onCheckedChange={(checked) => updateFormData({ petDamage: !!checked })}
              />
              <Label htmlFor="pet-damage" className="cursor-pointer">
                Pet damage (scratches, odors, hair)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="rust"
                checked={formData.rust || false}
                onCheckedChange={(checked) => updateFormData({ rust: !!checked })}
              />
              <Label htmlFor="rust" className="cursor-pointer">
                Visible rust or corrosion
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hail-damage"
                checked={formData.hailDamage || false}
                onCheckedChange={(checked) => updateFormData({ hailDamage: !!checked })}
              />
              <Label htmlFor="hail-damage" className="cursor-pointer">
                Hail damage (dents, dimples)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="frame-damage"
                checked={formData.frame_damage || false}
                onCheckedChange={(checked) => updateFormData({ frame_damage: !!checked })}
              />
              <Label htmlFor="frame-damage" className="cursor-pointer">
                Frame or structural damage
              </Label>
            </div>
          </div>

          {(formData.smoking || formData.petDamage || formData.rust || formData.hailDamage || formData.frame_damage) && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Impact on Value:</strong> These issues can significantly reduce your vehicle's value. 
                Frame damage and smoking odors have the largest negative impact.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
