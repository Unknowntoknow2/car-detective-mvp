
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

const offerSchema = z.object({
  amount: z.string().transform((val) => parseFloat(val)),
  message: z.string().optional(),
});

interface DealerOfferFormProps {
  reportId: string;
  onSubmit: (data: { offer_amount: number; message?: string }) => void;
  isSubmitting?: boolean;
}

export function DealerOfferForm({ reportId, onSubmit, isSubmitting }: DealerOfferFormProps) {
  const { user } = useAuth();
  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      amount: '',
      message: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof offerSchema>) => {
    if (!user) return;
    
    onSubmit({
      offer_amount: values.amount,
      message: values.message,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a message to the vehicle owner"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include any additional information or terms.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Offer'}
        </Button>
      </form>
    </Form>
  );
}
