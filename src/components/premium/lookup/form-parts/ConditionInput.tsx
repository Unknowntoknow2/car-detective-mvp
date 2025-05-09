import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { ConditionLevel } from '@/components/lookup/types/manualEntry'; // Fixed import

interface ConditionInputProps {
  form: UseFormReturn<any>;
}

export const ConditionInput: React.FC<ConditionInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="condition"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Condition</FormLabel>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              defaultValue={field.value} 
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value={ConditionLevel.Excellent} id="excellent" className="peer h-5 w-5 border-2 border-gray-300 text-primary shadow-[0_0_0_2px_white] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                </FormControl>
                <FormLabel htmlFor="excellent" className="font-normal">Excellent</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value={ConditionLevel.Good} id="good" className="peer h-5 w-5 border-2 border-gray-300 text-primary shadow-[0_0_0_2px_white] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                </FormControl>
                <FormLabel htmlFor="good" className="font-normal">Good</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value={ConditionLevel.Fair} id="fair" className="peer h-5 w-5 border-2 border-gray-300 text-primary shadow-[0_0_0_2px_white] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                </FormControl>
                <FormLabel htmlFor="fair" className="font-normal">Fair</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value={ConditionLevel.Poor} id="poor" className="peer h-5 w-5 border-2 border-gray-300 text-primary shadow-[0_0_0_2px_white] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                </FormControl>
                <FormLabel htmlFor="poor" className="font-normal">Poor</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
