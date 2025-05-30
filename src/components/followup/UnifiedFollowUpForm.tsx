
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { ReportData } from '@/utils/pdf/types';

const formSchema = z.object({
  vin: z.string().optional(),
  zip_code: z.string().min(5, {
    message: 'Zip code must be at least 5 characters.'
  }),
  additional_notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (values: FollowUpAnswers) => Promise<void>;
  onSave?: (values: FollowUpAnswers) => Promise<void>;
}

export function UnifiedFollowUpForm({ vin, initialData, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vin: vin || '',
      zip_code: initialData?.zip_code || '',
      additional_notes: initialData?.additional_notes || ''
    },
    mode: 'onChange'
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: FormData) => {
    console.log('📝 Form submitted with values:', values);
    
    // Convert FormData to FollowUpAnswers
    const followUpAnswers: FollowUpAnswers = {
      vin: vin,
      zip_code: values.zip_code,
      additional_notes: values.additional_notes || ''
    };

    try {
      await onSubmit(followUpAnswers);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleSave = async (values: FormData) => {
    console.log('💾 Form saved with values:', values);
    
    const followUpAnswers: FollowUpAnswers = {
      vin: vin,
      zip_code: values.zip_code,
      additional_notes: values.additional_notes || ''
    };

    try {
      await onSave?.(followUpAnswers);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter zip code" {...field} />
              </FormControl>
              <FormDescription>
                Please enter the zip code where the vehicle is located.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="additional_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about the vehicle?"
                  className="resize-none"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormDescription>
                Please provide any additional information that may be relevant to the valuation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          {onSave && (
            <Button
              type="button"
              variant="secondary"
              onClick={form.handleSubmit(handleSave)}
              disabled={isLoading}
            >
              Save Progress
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Valuation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
