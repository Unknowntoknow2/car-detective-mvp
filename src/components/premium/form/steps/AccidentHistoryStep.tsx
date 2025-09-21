
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccidentHistoryStepProps {
  form: UseFormReturn<any>;
}

export function AccidentHistoryStep({ form }: AccidentHistoryStepProps) {
  const hasAccident = form.watch("hasAccident");

  const handleAccidentChange = (value: any) => {
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accident History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="hasAccident"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Has this vehicle been in any accidents?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value: any) => field.onChange(value === "yes")}
                  value={field.value ? "yes" : "no"}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-accident" />
                    <label htmlFor="no-accident">No accidents</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="has-accident" />
                    <label htmlFor="has-accident">Yes, has been in accident(s)</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasAccident && (
          <FormField
            control={form.control}
            name="accidentDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accident Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe the accident(s) and any repairs made..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
