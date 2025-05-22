
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FactorSlider, ConditionOption } from './FactorSlider';
import { useValuationFactors, CategoryFactors } from '@/hooks/useValuationFactors';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { ConditionValues } from './types';

interface ConditionEvaluationGridProps {
  values: ConditionValues;
  onChange: (id: string, value: number | string) => void;
}

interface CategoryCard {
  key: string;
  title: string;
  description: string;
  factors: CategoryFactors;
}

export function ConditionEvaluationGrid({ values, onChange }: ConditionEvaluationGridProps) {
  const { categoryFactors, isLoading, error } = useValuationFactors();
  const [categoryCards, setCategoryCards] = useState<CategoryCard[]>([]);
  
  useEffect(() => {
    if (!isLoading && !error && Object.keys(categoryFactors).length > 0) {
      const cards: CategoryCard[] = [
        {
          key: 'exterior',
          title: 'Exterior Condition',
          description: 'Paint, body, glass, and trim',
          factors: categoryFactors['exterior'] || {}
        },
        {
          key: 'interior',
          title: 'Interior Condition',
          description: 'Seats, dashboard, carpet, and electronics',
          factors: categoryFactors['interior'] || {}
        },
        {
          key: 'mechanical',
          title: 'Mechanical Condition',
          description: 'Engine, transmission, suspension, and brakes',
          factors: categoryFactors['mechanical'] || {}
        },
        {
          key: 'tires',
          title: 'Tires & Wheels',
          description: 'Tread depth, wheel condition, and matching',
          factors: categoryFactors['tires'] || {}
        }
      ];
      
      setCategoryCards(cards);
    }
  }, [categoryFactors, isLoading, error]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load condition factors: {error}</p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categoryCards.map((category) => (
        <Card key={category.key} className="rounded-2xl shadow overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {Object.entries(category.factors).map(([factorName, options]) => {
                const id = `${category.key}${factorName.charAt(0).toUpperCase() + factorName.slice(1)}`;
                
                // Format the factor name for display (capitalize, add spaces)
                const displayName = factorName
                  .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                  .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
                  
                // For numeric sliders only - ensure the value is a number with default fallback
                const currentValue = values[id as keyof ConditionValues];
                const numericValue = typeof currentValue === 'number' ? currentValue : 50; // Default to 50 (Good) if not set or not a number
                
                return (
                  <FactorSlider
                    key={id}
                    id={id}
                    label={displayName}
                    options={options as ConditionOption[]}
                    value={numericValue}
                    onChange={(value) => onChange(id, value)}
                    ariaLabel={`${displayName} condition slider`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
