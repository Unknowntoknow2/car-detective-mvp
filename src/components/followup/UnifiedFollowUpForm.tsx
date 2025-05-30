
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { submitValuation } from '@/lib/valuation/submitValuation';
import { ReportData } from '@/utils/pdf/types';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const followUpSchema = z.object({
  vin: z.string().min(1, 'VIN is required'),
  zip_code: z.string().min(5, 'ZIP code is required')
});

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (data: FollowUpAnswers) => void;
  onSave: (data: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({
  vin,
  initialData,
  onSubmit,
  onSave
}: UnifiedFollowUpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FollowUpAnswers>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      vin,
      zip_code: '',
      ...initialData
    }
  });

  const handleSubmit = async (data: FollowUpAnswers) => {
    setIsSubmitting(true);
    
    try {
      // Save follow-up answers to database
      const { error: saveError } = await supabase
        .from('follow_up_answers')
        .upsert({
          vin: data.vin,
          zip_code: data.zip_code,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (saveError) {
        console.error('Error saving follow-up answers:', saveError);
        toast.error('Failed to save answers');
        return;
      }

      // Create mock report data for valuation submission
      const reportData: ReportData = {
        make: 'Unknown',
        model: 'Unknown', 
        year: 2020,
        mileage: 50000,
        condition: 'Good',
        estimatedValue: 25000,
        confidenceScore: 85,
        zipCode: data.zip_code,
        adjustments: [],
        generatedAt: new Date().toISOString(),
        vin: data.vin
      };

      // Submit valuation and trigger dealer notifications
      const result = await submitValuation({
        vin: data.vin,
        zipCode: data.zip_code,
        reportData,
        isPremium: true,
        notifyDealers: true
      });

      if (result.notificationsSent) {
        toast.success('Valuation completed and dealers notified!');
      } else {
        toast.success('Valuation completed successfully!');
      }

      onSubmit(data);
    } catch (error) {
      console.error('Error submitting follow-up:', error);
      toast.error('Failed to complete valuation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (data: FollowUpAnswers) => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('follow_up_answers')
        .upsert({
          vin: data.vin,
          zip_code: data.zip_code,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        console.error('Error saving follow-up answers:', error);
        toast.error('Failed to save progress');
        return;
      }

      toast.success('Progress saved');
      onSave(data);
    } catch (error) {
      console.error('Error saving follow-up:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Complete Your Valuation</h3>
            <p className="text-gray-600">
              Please confirm your details to complete the valuation process.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">VIN</label>
                <input
                  {...form.register('vin')}
                  className="w-full p-2 border rounded-md"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input
                  {...form.register('zip_code')}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave(form.getValues())}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Progress
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Complete Valuation
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
