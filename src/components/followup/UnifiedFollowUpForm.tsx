
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface UnifiedFollowUpFormProps {
  vin?: string;
  onSubmit: (answers: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onSubmit }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin: vin || '',
    mileage: undefined,
    zip_code: '',
    condition: 'good',
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false
    },
    service_history: 'unknown',
    maintenance_status: 'Unknown',
    title_status: 'clean',
    previous_owners: 1,
    previous_use: 'personal',
    tire_condition: 'good',
    dashboard_lights: [],
    frame_damage: false,
    modifications: {
      modified: false,
      types: [],
      reversible: true
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateAccidentData = (updates: Partial<FollowUpAnswers['accidents']>) => {
    setFormData(prev => ({
      ...prev,
      accidents: { ...prev.accidents, ...updates }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mileage || !formData.zip_code) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
        {vin && (
          <p className="text-sm text-muted-foreground">VIN: {vin}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="e.g. 45000"
                value={formData.mileage || ''}
                onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || undefined })}
                required
              />
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code *</Label>
              <Input
                id="zip_code"
                placeholder="e.g. 90210"
                value={formData.zip_code}
                onChange={(e) => updateFormData({ zip_code: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Vehicle Condition */}
          <div>
            <Label htmlFor="condition">Overall Condition</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => 
                updateFormData({ condition: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accident History */}
          <div className="space-y-4">
            <Label>Has this vehicle been in any accidents?</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.accidents?.hadAccident === false ? "default" : "outline"}
                onClick={() => updateAccidentData({ hadAccident: false })}
              >
                No
              </Button>
              <Button
                type="button"
                variant={formData.accidents?.hadAccident === true ? "default" : "outline"}
                onClick={() => updateAccidentData({ hadAccident: true })}
              >
                Yes
              </Button>
            </div>

            {formData.accidents?.hadAccident && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="accident-severity">Severity</Label>
                  <Select 
                    value={formData.accidents.severity} 
                    onValueChange={(value: 'minor' | 'moderate' | 'major') => 
                      updateAccidentData({ severity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.accidents.repaired || false}
                      onChange={(e) => updateAccidentData({ repaired: e.target.checked })}
                    />
                    <span>Properly repaired</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Title Status */}
          <div>
            <Label htmlFor="title_status">Title Status</Label>
            <Select 
              value={formData.title_status} 
              onValueChange={(value: string) => updateFormData({ title_status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="salvage">Salvage</SelectItem>
                <SelectItem value="rebuilt">Rebuilt</SelectItem>
                <SelectItem value="branded">Branded</SelectItem>
                <SelectItem value="lemon">Lemon Law</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Previous Owners */}
          <div>
            <Label htmlFor="previous_owners">Number of Previous Owners</Label>
            <Input
              id="previous_owners"
              type="number"
              min="1"
              value={formData.previous_owners || 1}
              onChange={(e) => updateFormData({ previous_owners: parseInt(e.target.value) || 1 })}
            />
          </div>

          {/* Service History */}
          <div>
            <Label htmlFor="service_history">Service History</Label>
            <Select 
              value={formData.service_history} 
              onValueChange={(value: string) => updateFormData({ service_history: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service history" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dealer">Dealer-maintained</SelectItem>
                <SelectItem value="independent">Independent mechanic</SelectItem>
                <SelectItem value="owner">Owner-maintained</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Calculating...' : 'Get Valuation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
