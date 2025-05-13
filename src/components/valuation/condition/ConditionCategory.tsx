
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConditionRatingOption } from '@/types/condition';

export interface ConditionCategoryProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  ratings?: ConditionRatingOption[];
  selectedRating?: ConditionRatingOption | null;
  onSelect?: (rating: ConditionRatingOption) => void;
}

export function ConditionCategory({
  title,
  description,
  children,
  ratings,
  selectedRating,
  onSelect
}: ConditionCategoryProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}
