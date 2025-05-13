
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ConditionRating } from './types';

interface ConditionCategoryProps {
  title: string;
  description: string;
  ratings: ConditionRating[];
  selectedRating: string;
  onSelect: (rating: ConditionRating) => void;
}

export function ConditionCategory({
  title,
  description,
  ratings,
  selectedRating,
  onSelect
}: ConditionCategoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedRating === rating.id
                  ? 'bg-primary/10 border border-primary/50'
                  : 'hover:bg-muted border border-transparent'
              }`}
              onClick={() => onSelect(rating)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{rating.name}</span>
                <span className="text-sm text-muted-foreground">{rating.value}</span>
              </div>
              {rating.description && (
                <p className="text-sm text-muted-foreground mt-1">{rating.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
