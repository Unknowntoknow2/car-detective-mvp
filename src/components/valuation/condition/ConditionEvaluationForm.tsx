
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ConditionCategory } from './ConditionCategory';
import { ConditionSummary } from './ConditionSummary';
import { ConditionTips } from './ConditionTips';
import { 
  exteriorCategories, 
  interiorCategories, 
  mechanicalCategories, 
  tiresCategories 
} from './conditionData';

export type ConditionRating = {
  id: string;
  name: string;
  value: number;
  category: string;
};

export function ConditionEvaluationForm({ 
  initialValues = {}, 
  onSubmit, 
  onCancel 
}: { 
  initialValues?: Record<string, number>;
  onSubmit: (values: Record<string, number>, overallScore: number) => void;
  onCancel?: () => void;
}) {
  const [ratings, setRatings] = useState<ConditionRating[]>([]);
  const [overallScore, setOverallScore] = useState(75); // Default to "Good" condition
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Initialize with default values
  useEffect(() => {
    const initialRatings: ConditionRating[] = [
      ...exteriorCategories.map(item => ({
        ...item,
        value: initialValues[item.id] || 75,
      })),
      ...interiorCategories.map(item => ({
        ...item,
        value: initialValues[item.id] || 75,
      })),
      ...mechanicalCategories.map(item => ({
        ...item,
        value: initialValues[item.id] || 75,
      })),
      ...tiresCategories.map(item => ({
        ...item,
        value: initialValues[item.id] || 75,
      })),
    ];
    
    setRatings(initialRatings);
  }, [initialValues]);
  
  // Recalculate overall score when ratings change
  useEffect(() => {
    if (ratings.length === 0) return;
    
    // Calculate weighted average (higher weights for mechanical and tires)
    const weights = {
      exterior: 0.25,
      interior: 0.20,
      mechanical: 0.35,
      tires: 0.20,
    };
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    ratings.forEach(rating => {
      const weight = weights[rating.category as keyof typeof weights];
      weightedSum += rating.value * weight;
      totalWeight += weight;
    });
    
    const newOverallScore = Math.round(weightedSum / totalWeight);
    setOverallScore(newOverallScore);
  }, [ratings]);
  
  const handleRatingChange = (id: string, value: number) => {
    setRatings(prev => 
      prev.map(rating => 
        rating.id === id ? { ...rating, value } : rating
      )
    );
    
    // Set this as the active category for tips
    const category = ratings.find(r => r.id === id)?.category || null;
    setActiveCategory(category);
  };
  
  const handleSubmit = () => {
    const values = ratings.reduce((acc, rating) => {
      acc[rating.id] = rating.value;
      return acc;
    }, {} as Record<string, number>);
    
    onSubmit(values, overallScore);
  };
  
  // Group ratings by category
  const groupedRatings = ratings.reduce((acc, rating) => {
    if (!acc[rating.category]) {
      acc[rating.category] = [];
    }
    acc[rating.category].push(rating);
    return acc;
  }, {} as Record<string, ConditionRating[]>);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Vehicle Condition Evaluation</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-5 w-5 text-slate-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-4" side="left">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">How to Use This Form</h3>
                <p className="text-xs text-slate-600">
                  Evaluate each aspect of your vehicle by moving the sliders. The 
                  more accurate your assessment, the more precise your valuation will be.
                </p>
                <p className="text-xs text-slate-600">
                  Hover over each slider for detailed description of what each condition level means.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <ConditionSummary overallScore={overallScore} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Exterior Section */}
          <ConditionCategory 
            title="Exterior Condition" 
            description="Body, paint, glass, and trim"
            ratings={groupedRatings.exterior || []} 
            onChange={handleRatingChange} 
          />
          
          {/* Interior Section */}
          <ConditionCategory 
            title="Interior Condition" 
            description="Seats, dashboard, carpet, and controls"
            ratings={groupedRatings.interior || []} 
            onChange={handleRatingChange} 
          />
        </div>
        
        <div className="space-y-6">
          {/* Mechanical Section */}
          <ConditionCategory 
            title="Mechanical Condition" 
            description="Engine, transmission, brakes, and electrical"
            ratings={groupedRatings.mechanical || []} 
            onChange={handleRatingChange} 
          />
          
          {/* Tires & Wheels Section */}
          <ConditionCategory 
            title="Tires & Wheels" 
            description="Tread depth, wheel condition, and alignment"
            ratings={groupedRatings.tires || []} 
            onChange={handleRatingChange} 
          />
        </div>
      </div>
      
      <Card className="p-4 border-primary/20 bg-primary/5">
        <ConditionTips 
          overallScore={overallScore} 
          activeCategory={activeCategory}
          ratings={ratings}
        />
      </Card>
      
      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit}>
          Save Condition Assessment
        </Button>
      </div>
    </div>
  );
}
