
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import { ConditionTips } from '@/components/valuation/condition/ConditionTips';

interface DetailedConditionRatingProps {
  onConditionChange?: (value: number, category: string) => void;
  initialValues?: Record<string, number>;
}

export function DetailedConditionRating({ onConditionChange, initialValues = {} }: DetailedConditionRatingProps) {
  // Define condition categories
  const categories = [
    {
      id: 'exterior',
      name: 'Exterior',
      description: 'Paint, body, glass, lights, and trim condition'
    },
    {
      id: 'interior',
      name: 'Interior',
      description: 'Seats, dash, carpet, electronics, and headliner'
    },
    {
      id: 'mechanical',
      name: 'Mechanical',
      description: 'Engine, transmission, suspension, brakes'
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Service records, recent repairs, and routine maintenance'
    }
  ];

  // Initialize state with default values or provided initialValues
  const [ratings, setRatings] = useState<Record<string, number>>({
    exterior: initialValues.exterior || 75,
    interior: initialValues.interior || 75,
    mechanical: initialValues.mechanical || 75,
    maintenance: initialValues.maintenance || 75
  });

  // Category for currently displayed tip
  const [activeTipCategory, setActiveTipCategory] = useState('exterior');

  // Tips for different condition levels per category
  const conditionTips: Record<string, Record<string, string>> = {
    exterior: {
      poor: "Paint is faded/damaged with visible rust/dents. Mismatched body panels or previous accident damage.",
      fair: "Some scratches, minor dents, or fading. Glass may have chips. Trim may be faded.",
      good: "Minor imperfections in paint. No significant dents or damage. Trim and glass in good condition.",
      excellent: "Paint has deep shine with no significant scratches. No dents or body damage. All trim intact and like-new."
    },
    interior: {
      poor: "Significant wear on seats, carpet stains, dash cracks, non-functioning electronics.",
      fair: "Noticeable wear on high-touch areas. Some stains on carpet or seats. Minor dash wear.",
      good: "Minimal wear on seats and carpet. All electronics function. Minor wear on steering wheel.",
      excellent: "Interior looks nearly new. No significant wear on seats, dash, or carpet. Like-new appearance."
    },
    mechanical: {
      poor: "Noticeable mechanical issues. May have irregular engine sound, rough shifting, or braking issues.",
      fair: "Engine runs, but may need minor maintenance. Some normal wear on mechanical components.",
      good: "Engine and transmission operate smoothly. Brakes and suspension in good condition.",
      excellent: "All mechanical systems function flawlessly. Recent service records. No issues during operation."
    },
    maintenance: {
      poor: "Limited or no service records. Overdue for multiple maintenance items.",
      fair: "Some maintenance records. May be due for major service items like timing belt.",
      good: "Regular maintenance performed, though some items may be coming due.",
      excellent: "Complete service history. All maintenance up to date. Recent major services completed."
    }
  };

  // Get condition label based on rating value
  const getConditionLabel = (value: number): string => {
    if (value <= 25) return 'poor';
    if (value <= 50) return 'fair';
    if (value <= 75) return 'good';
    return 'excellent';
  };

  // Get condition style based on rating value
  const getConditionStyle = (value: number): string => {
    if (value <= 25) return 'text-red-600';
    if (value <= 50) return 'text-amber-600';
    if (value <= 75) return 'text-blue-600';
    return 'text-green-600';
  };

  // Handle slider value change
  const handleSliderChange = (value: number[], categoryId: string) => {
    const newRating = value[0];
    const newRatings = { ...ratings, [categoryId]: newRating };
    setRatings(newRatings);
    setActiveTipCategory(categoryId);
    
    if (onConditionChange) {
      onConditionChange(newRating, categoryId);
    }
  };

  // Get the current tip text based on active category and its rating
  const getCurrentTip = (): string => {
    const rating = ratings[activeTipCategory];
    const conditionLabel = getConditionLabel(rating);
    return conditionTips[activeTipCategory][conditionLabel];
  };

  // Calculate overall condition as average of all ratings
  const overallCondition = Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.keys(ratings).length;
  const overallConditionLabel = getConditionLabel(overallCondition);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vehicle Condition Assessment</h3>
        <Badge className={`px-3 py-1 ${getConditionStyle(overallCondition)}`}>
          {overallConditionLabel.charAt(0).toUpperCase() + overallConditionLabel.slice(1)} ({Math.round(overallCondition)}%)
        </Badge>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category.id} className={`border-l-4 ${ratings[category.id] === ratings[activeTipCategory] && activeTipCategory === category.id ? 'border-l-primary' : 'border-l-transparent'}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Badge className={getConditionStyle(ratings[category.id])}>
                  {getConditionLabel(ratings[category.id]).charAt(0).toUpperCase() + 
                   getConditionLabel(ratings[category.id]).slice(1)}
                </Badge>
              </div>
              
              <div className="pt-2 pb-4">
                <Slider
                  value={[ratings[category.id]]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => handleSliderChange(value, category.id)}
                  onValueCommit={() => setActiveTipCategory(category.id)}
                  className="mb-2"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              {activeTipCategory === category.id && (
                <div className="mt-2 flex items-start gap-2 pt-2 border-t">
                  <InfoIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-600">{getCurrentTip()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <ConditionTips 
          category={activeTipCategory.charAt(0).toUpperCase() + activeTipCategory.slice(1)} 
          tip={getCurrentTip()} 
        />
      </div>
    </div>
  );
}
