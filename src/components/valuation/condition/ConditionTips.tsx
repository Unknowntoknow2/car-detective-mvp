
import React from 'react';
import { ArrowUp, Lightbulb } from 'lucide-react';
import { ConditionRating } from './types';
import { getImprovementTips } from './conditionTips';

interface ConditionTipsProps {
  overallScore: number;
  activeCategory: string | null;
  ratings: ConditionRating[];
}

export function ConditionTips({ overallScore, activeCategory, ratings }: ConditionTipsProps) {
  const activeCategoryRatings = activeCategory 
    ? ratings.filter(r => r.category === activeCategory)
    : [];
  
  // Find lowest rated items in active category (or overall if no active category)
  const lowestRated = activeCategory
    ? activeCategoryRatings.sort((a, b) => a.value - b.value).slice(0, 2)
    : ratings.sort((a, b) => a.value - b.value).slice(0, 3);
  
  // Get improvement tips for each low-rated item
  const improvementTips = lowestRated.map(rating => ({
    ...rating,
    tip: getImprovementTips(rating.id, rating.value)
  })).filter(item => item.tip && item.value < 80); // Only show tips for items below "Very Good"
  
  if (improvementTips.length === 0) {
    return (
      <div className="flex items-center gap-3 text-primary">
        <Lightbulb className="h-5 w-5" />
        <p className="text-sm">
          Your vehicle is in great condition! Keep up the regular maintenance to maintain its value.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium text-slate-800">
          Value Improvement Tips
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {improvementTips.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-md border border-slate-200 shadow-sm">
            <h4 className="text-sm font-medium text-slate-700 mb-1">{item.name}</h4>
            <p className="text-xs text-slate-600 mb-2">{item.tip}</p>
            
            <div className="flex items-center gap-1 text-xs text-primary font-medium">
              <ArrowUp className="h-3 w-3" />
              <span>Potential value increase</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
