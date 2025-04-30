
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ConditionSlider } from './ConditionSlider';
import { ConditionRating } from './ConditionEvaluationForm';

interface ConditionCategoryProps {
  title: string;
  description: string;
  ratings: ConditionRating[];
  onChange: (id: string, value: number) => void;
}

export function ConditionCategory({ title, description, ratings, onChange }: ConditionCategoryProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="items" className="w-full">
          <AccordionItem value="items" className="border-none">
            <AccordionTrigger className="py-2 text-sm">
              View All Items ({ratings.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-5 pt-2">
                {ratings.map((rating) => (
                  <ConditionSlider
                    key={rating.id}
                    id={rating.id}
                    name={rating.name}
                    value={rating.value}
                    onChange={(value) => onChange(rating.id, value)}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
