
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { FollowUpAnswers, AccidentDetails, ModificationDetails, MAINTENANCE_STATUS_OPTIONS } from '@/types/follow-up-answers';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedFollowUpFormProps {
  vin?: string;
  plateNumber?: string;
  initialData?: ManualEntryFormData;
  entryMethod?: 'vin' | 'plate' | 'manual';
  onComplete?: () => void;
}

export function UnifiedFollowUpForm({
  vin,
  plateNumber,
  initialData,
  entryMethod = 'manual',
  onComplete
}: UnifiedFollowUpFormProps) {
  const [answers, setAnswers] = useState<FollowUpAnswers>({
    vin: vin || '',
    mileage: typeof initialData?.mileage === 'string' ? parseInt(initialData.mileage) : initialData?.mileage,
    zip_code: initialData?.zipCode || '',
    // Convert ConditionLevel enum to expected string type, defaulting to 'good' for VeryGood
    condition: initialData?.condition === 'very_good' ? 'good' : (initialData?.condition as 'excellent' | 'good' | 'fair' | 'poor') || 'good',
    accidents: { hadAccident: false },
    service_history: 'unknown',
    maintenance_status: 'Unknown',
    title_status: 'clean',
    tire_condition: 'good',
    dashboard_lights: [],
    frame_damage: false,
    modifications: { modified: false },
    completion_percentage: 0,
    is_complete: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Calculate completion percentage based on filled fields
    const totalFields = 12;
    const filledFields = [
      answers.mileage,
      answers.zip_code,
      answers.condition,
      answers.service_history,
      answers.maintenance_status,
      answers.title_status,
      answers.tire_condition,
      answers.dashboard_lights?.length,
      answers.accidents?.hadAccident !== undefined,
      answers.frame_damage !== undefined,
      answers.modifications?.modified !== undefined
    ].filter(Boolean).length;
    
    const percentage = Math.round((filledFields / totalFields) * 100);
    setAnswers(prev => ({ ...prev, completion_percentage: percentage }));
  }, [answers]);

  const handleInputChange = (field: keyof FollowUpAnswers, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value,
      updated_at: new Date().toISOString()
    }));
  };

  const handleSubmit = async () => {
    if (!answers.mileage || !answers.zip_code) {
      toast.error('Please fill in required fields: Mileage and Zip Code');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...answers,
        is_complete: true,
        completion_percentage: 100,
        created_at: answers.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        submissionData.user_id = user.id;
        
        const { error } = await supabase
          .from('follow_up_answers')
          .upsert(submissionData);
          
        if (error) {
          console.error('Error saving follow-up answers:', error);
          toast.error('Failed to save answers');
          return;
        }
      }

      toast.success('Follow-up completed successfully!');
      onComplete?.();
    } catch (error) {
      console.error('Error submitting follow-up:', error);
      toast.error('Failed to submit follow-up');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Vehicle Follow-Up Details
            <span className="text-sm text-muted-foreground">
              {answers.completion_percentage}% Complete
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Current Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                value={answers.mileage || ''}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || undefined)}
                placeholder="Enter current mileage"
                required
              />
            </div>
            <div>
              <Label htmlFor="zip_code">Zip Code *</Label>
              <Input
                id="zip_code"
                type="text"
                value={answers.zip_code || ''}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                placeholder="Enter zip code"
                maxLength={5}
                required
              />
            </div>
          </div>

          {/* Condition Selector */}
          <ConditionSelector
            value={answers.condition}
            onChange={(condition: 'excellent' | 'good' | 'fair' | 'poor') => 
              handleInputChange('condition', condition)
            }
          />

          {/* Service History */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Service & Maintenance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service_history">Service History</Label>
                <select
                  id="service_history"
                  value={answers.service_history || 'unknown'}
                  onChange={(e) => handleInputChange('service_history', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="dealer">Dealer-maintained</option>
                  <option value="independent">Independent mechanic</option>
                  <option value="owner">Owner-maintained</option>
                  <option value="unknown">No known history</option>
                </select>
              </div>
              <div>
                <Label htmlFor="maintenance_status">Maintenance Status</Label>
                <select
                  id="maintenance_status"
                  value={answers.maintenance_status || 'Unknown'}
                  onChange={(e) => handleInputChange('maintenance_status', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {MAINTENANCE_STATUS_OPTIONS.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Title Status */}
          <div>
            <Label htmlFor="title_status">Title Status</Label>
            <select
              id="title_status"
              value={answers.title_status || 'clean'}
              onChange={(e) => handleInputChange('title_status', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="clean">Clean</option>
              <option value="salvage">Salvage</option>
              <option value="rebuilt">Rebuilt</option>
              <option value="branded">Branded</option>
              <option value="lemon">Lemon Law</option>
            </select>
          </div>

          {/* Tire Condition */}
          <div>
            <Label htmlFor="tire_condition">Tire Condition</Label>
            <select
              id="tire_condition"
              value={answers.tire_condition || 'good'}
              onChange={(e) => handleInputChange('tire_condition', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="excellent">Excellent (8/32"+ tread)</option>
              <option value="good">Good (6–7/32")</option>
              <option value="worn">Worn (3–5/32")</option>
              <option value="replacement">Needs Replacement (&lt;3/32")</option>
            </select>
          </div>

          {/* Accident Section */}
          <AccidentSection
            value={answers.accidents}
            onChange={(accidents: AccidentDetails) => handleInputChange('accidents', accidents)}
          />

          {/* Dashboard Lights */}
          <DashboardLightsSection
            value={answers.dashboard_lights || []}
            onChange={(dashboard_lights: string[]) => handleInputChange('dashboard_lights', dashboard_lights)}
          />

          {/* Modifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Modifications</h3>
            <div className="space-y-2">
              <Label>Has this vehicle been modified?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="modifications"
                    checked={!answers.modifications?.modified}
                    onChange={() => handleInputChange('modifications', { modified: false })}
                  />
                  No
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="modifications"
                    checked={answers.modifications?.modified}
                    onChange={() => handleInputChange('modifications', { 
                      modified: true, 
                      types: [], 
                      reversible: false 
                    })}
                  />
                  Yes
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !answers.mileage || !answers.zip_code}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Complete Follow-Up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
