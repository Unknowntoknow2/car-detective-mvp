
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ConditionCategory } from './ConditionCategory';
import { ConditionTips } from './ConditionTips';
import { ConditionValues, ConditionEvaluationFormProps, ConditionRatingOption } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const conditionCategories = {
  exterior: {
    title: 'Exterior Condition',
    description: 'Paint, body, glass, and trim condition',
    ratings: [
      { id: 'exterior_poor', name: 'Poor', category: 'Exterior', value: 70, description: 'Visible damage, rust, or paint issues', tip: 'Consider addressing visible paint and body damage before selling' },
      { id: 'exterior_fair', name: 'Fair', category: 'Exterior', value: 80, description: 'Some minor issues or wear visible' },
      { id: 'exterior_good', name: 'Good', category: 'Exterior', value: 90, description: 'Minor wear, but no significant issues' },
      { id: 'exterior_excellent', name: 'Excellent', category: 'Exterior', value: 100, description: 'Like new condition with minimal wear' }
    ]
  },
  interior: {
    title: 'Interior Condition',
    description: 'Seats, dashboard, carpet, and electronics',
    ratings: [
      { id: 'interior_poor', name: 'Poor', category: 'Interior', value: 70, description: 'Visible damage, stains, or non-working components', tip: 'A professional interior detail could improve value' },
      { id: 'interior_fair', name: 'Fair', category: 'Interior', value: 80, description: 'Some wear or minor issues' },
      { id: 'interior_good', name: 'Good', category: 'Interior', value: 90, description: 'Minor wear, but clean and functioning' },
      { id: 'interior_excellent', name: 'Excellent', category: 'Interior', value: 100, description: 'Like new condition with minimal wear' }
    ]
  },
  mechanical: {
    title: 'Mechanical Condition',
    description: 'Engine, transmission, suspension, and brakes',
    ratings: [
      { id: 'mechanical_poor', name: 'Poor', category: 'Mechanical', value: 70, description: 'Has issues that affect driveability', tip: 'Fixing major mechanical issues typically has a good ROI for valuation' },
      { id: 'mechanical_fair', name: 'Fair', category: 'Mechanical', value: 80, description: 'Some maintenance needed soon' },
      { id: 'mechanical_good', name: 'Good', category: 'Mechanical', value: 90, description: 'Regular maintenance up to date, no issues' },
      { id: 'mechanical_excellent', name: 'Excellent', category: 'Mechanical', value: 100, description: 'Perfect mechanical condition, all service records' }
    ]
  },
  tires: {
    title: 'Tire Condition',
    description: 'Tread depth and overall tire condition',
    ratings: [
      { id: 'tires_poor', name: 'Poor', category: 'Tires', value: 70, description: 'Need immediate replacement', tip: 'New tires can improve the valuation and help sell faster' },
      { id: 'tires_fair', name: 'Fair', category: 'Tires', value: 80, description: 'Will need replacement soon' },
      { id: 'tires_good', name: 'Good', category: 'Tires', value: 90, description: 'Good tread life remaining' },
      { id: 'tires_excellent', name: 'Excellent', category: 'Tires', value: 100, description: 'Like new with 80%+ tread life' }
    ]
  }
};

export function ConditionEvaluationForm({ onSubmit, onCancel, initialValues }: ConditionEvaluationFormProps) {
  const [activeCategory, setActiveCategory] = useState<string>('exterior');
  const [selectedRatings, setSelectedRatings] = useState<Record<string, ConditionRatingOption>>({
    exterior: conditionCategories.exterior.ratings[2], // Default to "Good"
    interior: conditionCategories.interior.ratings[2],
    mechanical: conditionCategories.mechanical.ratings[2],
    tires: conditionCategories.tires.ratings[2]
  });
  
  const [conditionValues, setConditionValues] = useState<ConditionValues>({
    accidents: initialValues?.accidents || 0,
    mileage: initialValues?.mileage || 0,
    year: initialValues?.year || new Date().getFullYear(),
    titleStatus: initialValues?.titleStatus || 'Clean',
    exteriorGrade: 90,
    interiorGrade: 90,
    mechanicalGrade: 90,
    tireCondition: 90
  });
  
  // Update condition values when ratings change
  useEffect(() => {
    setConditionValues(prev => ({
      ...prev,
      exteriorGrade: selectedRatings.exterior?.value || 90,
      interiorGrade: selectedRatings.interior?.value || 90,
      mechanicalGrade: selectedRatings.mechanical?.value || 90,
      tireCondition: selectedRatings.tires?.value || 90
    }));
  }, [selectedRatings]);
  
  const handleRatingSelect = (category: string, rating: ConditionRatingOption) => {
    setSelectedRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };
  
  const handleNext = () => {
    const categories = Object.keys(conditionCategories);
    const currentIndex = categories.indexOf(activeCategory);
    
    if (currentIndex < categories.length - 1) {
      setActiveCategory(categories[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    const categories = Object.keys(conditionCategories);
    const currentIndex = categories.indexOf(activeCategory);
    
    if (currentIndex > 0) {
      setActiveCategory(categories[currentIndex - 1]);
    } else if (onCancel) {
      onCancel();
    }
  };
  
  const handleSubmit = () => {
    // Calculate overall score based on selected ratings
    const values = Object.values(selectedRatings).map(r => r.value);
    const overallScore = values.reduce((sum, value) => sum + value, 0) / values.length;
    
    if (onSubmit) {
      onSubmit(conditionValues, overallScore);
    }
  };
  
  const isLastCategory = activeCategory === Object.keys(conditionCategories)[Object.keys(conditionCategories).length - 1];
  
  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {Object.keys(conditionCategories).map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="whitespace-nowrap"
          >
            {conditionCategories[category as keyof typeof conditionCategories].title}
          </Button>
        ))}
      </div>
      
      {/* Active Category */}
      <div>
        <ConditionCategory
          title={conditionCategories[activeCategory as keyof typeof conditionCategories].title}
          description={conditionCategories[activeCategory as keyof typeof conditionCategories].description}
          ratings={conditionCategories[activeCategory as keyof typeof conditionCategories].ratings}
          selectedRating={selectedRatings[activeCategory]?.id}
          onSelect={(rating) => handleRatingSelect(activeCategory, rating)}
        />
      </div>
      
      {/* Condition Tips */}
      <ConditionTips selectedRatings={selectedRatings} />
      
      {/* Selected Ratings Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(selectedRatings).map(([category, rating]) => (
              <div key={category} className="flex justify-between">
                <span className="text-muted-foreground">{conditionCategories[category as keyof typeof conditionCategories].title}:</span>
                <span className="font-medium">{rating.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <Button 
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {activeCategory === Object.keys(conditionCategories)[0] ? 'Cancel' : 'Previous'}
        </Button>
        
        <Button 
          onClick={handleNext}
          className="flex items-center gap-1"
        >
          {isLastCategory ? 'Submit' : 'Next'}
          {!isLastCategory && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
