
import React from 'react';
import { z } from 'zod';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface AdditionalDetailsFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

// Zod validation schema for this tab
export const additionalDetailsSchema = z.object({
  additional_notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  service_history: z.string().max(500, 'Service history must be less than 500 characters').optional(),
  smoking: z.boolean().optional(),
  petDamage: z.boolean().optional(),
  rust: z.boolean().optional(),
  hailDamage: z.boolean().optional(),
  frame_damage: z.boolean().optional(),
});

export const AdditionalDetailsForm: React.FC<AdditionalDetailsFormProps> = ({ formData, updateFormData }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (field: string, value: any) => {
    try {
      additionalDetailsSchema.pick({ [field]: true } as any).parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ 
          ...prev, 
          [field]: error.errors[0]?.message || 'Invalid value' 
        }));
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof FollowUpAnswers, value: any) => {
    updateFormData({ [field]: value });
    validateField(field, value);
  };

  const validateAllFields = () => {
    try {
      additionalDetailsSchema.parse({
        additional_notes: formData.additional_notes,
        service_history: formData.service_history,
        smoking: formData.smoking,
        petDamage: formData.petDamage,
        rust: formData.rust,
        hailDamage: formData.hailDamage,
        frame_damage: formData.frame_damage,
      });
      setErrors({});
      toast.success('Additional details validated successfully');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Please fix the validation errors');
      }
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Additional Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service History */}
          <div className="space-y-2">
            <Label htmlFor="service_history">Service History</Label>
            <Textarea
              id="service_history"
              placeholder="Describe the vehicle's service history..."
              value={formData.service_history || ''}
              onChange={(e) => handleInputChange('service_history', e.target.value)}
              className={errors.service_history ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.service_history && (
              <p className="text-sm text-red-500">{errors.service_history}</p>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              placeholder="Any additional information about the vehicle..."
              value={formData.additional_notes || ''}
              onChange={(e) => handleInputChange('additional_notes', e.target.value)}
              className={errors.additional_notes ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.additional_notes && (
              <p className="text-sm text-red-500">{errors.additional_notes}</p>
            )}
          </div>

          {/* Vehicle Issues Checkboxes */}
          <div className="space-y-3">
            <Label>Vehicle Issues (Check all that apply)</Label>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smoking"
                  checked={formData.smoking || false}
                  onCheckedChange={(checked) => handleInputChange('smoking', checked)}
                />
                <Label htmlFor="smoking">Smoking odor/evidence</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="petDamage"
                  checked={formData.petDamage || false}
                  onCheckedChange={(checked) => handleInputChange('petDamage', checked)}
                />
                <Label htmlFor="petDamage">Pet damage</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rust"
                  checked={formData.rust || false}
                  onCheckedChange={(checked) => handleInputChange('rust', checked)}
                />
                <Label htmlFor="rust">Rust/corrosion</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hailDamage"
                  checked={formData.hailDamage || false}
                  onCheckedChange={(checked) => handleInputChange('hailDamage', checked)}
                />
                <Label htmlFor="hailDamage">Hail damage</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="frame_damage"
                  checked={formData.frame_damage || false}
                  onCheckedChange={(checked) => handleInputChange('frame_damage', checked)}
                />
                <Label htmlFor="frame_damage">Frame/structural damage</Label>
              </div>
            </div>
          </div>

          <Button onClick={validateAllFields} variant="outline" className="w-full mt-4">
            Validate This Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
