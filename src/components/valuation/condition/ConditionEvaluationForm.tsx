
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConditionCategory } from './ConditionCategory';
import { ConditionTips } from './ConditionTips';
import { ConditionSlider } from './ConditionSlider';
import { ConditionEvaluationFormProps, ConditionValues } from './types';
import { ConditionRatingOption } from '@/types/condition';

const exteriorRatings = [
  { id: 'exterior-excellent', name: 'Excellent', category: 'Exterior', value: 4, description: 'Like new condition with no visible damage or wear.' },
  { id: 'exterior-good', name: 'Good', category: 'Exterior', value: 3, description: 'Minor wear consistent with age, no significant damage.' },
  { id: 'exterior-fair', name: 'Fair', category: 'Exterior', value: 2, description: 'Noticeable wear and tear, may have minor damage.' },
  { id: 'exterior-poor', name: 'Poor', category: 'Exterior', value: 1, description: 'Significant damage, rust, or cosmetic issues.' },
  { id: 'exterior-salvage', name: 'Salvage', category: 'Exterior', value: 0, description: 'Major damage affecting structure and appearance.' }
];

const interiorRatings = [
  { id: 'interior-excellent', name: 'Excellent', category: 'Interior', value: 4, description: 'Pristine interior with no wear or damage.' },
  { id: 'interior-good', name: 'Good', category: 'Interior', value: 3, description: 'Minor wear on seats and surfaces, all features functional.' },
  { id: 'interior-fair', name: 'Fair', category: 'Interior', value: 2, description: 'Visible wear on high-touch areas, may have minor damage.' },
  { id: 'interior-poor', name: 'Poor', category: 'Interior', value: 1, description: 'Significant wear, stains, or damage to interior components.' },
  { id: 'interior-salvage', name: 'Salvage', category: 'Interior', value: 0, description: 'Major interior damage requiring extensive repair.' }
];

const mechanicalRatings = [
  { id: 'mechanical-excellent', name: 'Excellent', category: 'Mechanical', value: 4, description: 'Perfect mechanical condition, no issues.' },
  { id: 'mechanical-good', name: 'Good', category: 'Mechanical', value: 3, description: 'Well-maintained, no known issues, all systems functional.' },
  { id: 'mechanical-fair', name: 'Fair', category: 'Mechanical', value: 2, description: 'Some minor issues may exist, but still reliable.' },
  { id: 'mechanical-poor', name: 'Poor', category: 'Mechanical', value: 1, description: 'Known mechanical issues affecting reliability.' },
  { id: 'mechanical-salvage', name: 'Salvage', category: 'Mechanical', value: 0, description: 'Major mechanical issues requiring significant repair.' }
];

export function ConditionEvaluationForm({ 
  initialValues = {}, 
  onSubmit,
  isLoading = false,
  onCancel
}: ConditionEvaluationFormProps) {
  const [values, setValues] = useState<ConditionValues>({
    accidents: initialValues.accidents || 0,
    mileage: initialValues.mileage || 0,
    year: initialValues.year || 0,
    titleStatus: initialValues.titleStatus || 'Clean',
    exteriorGrade: initialValues.exteriorGrade || 3,
    interiorGrade: initialValues.interiorGrade || 3,
    mechanicalGrade: initialValues.mechanicalGrade || 3
  });

  const [selectedRatings, setSelectedRatings] = useState<Record<string, ConditionRatingOption>>({
    exterior: exteriorRatings[values.exteriorGrade],
    interior: interiorRatings[values.interiorGrade],
    mechanical: mechanicalRatings[values.mechanicalGrade]
  });

  const handleChange = (id: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [id]: value
    }));

    // Update selected ratings when slider values change
    if (id === 'exteriorGrade') {
      setSelectedRatings(prev => ({
        ...prev,
        exterior: exteriorRatings[value]
      }));
    } else if (id === 'interiorGrade') {
      setSelectedRatings(prev => ({
        ...prev,
        interior: interiorRatings[value]
      }));
    } else if (id === 'mechanicalGrade') {
      setSelectedRatings(prev => ({
        ...prev,
        mechanical: mechanicalRatings[value]
      }));
    }
  };

  const handleRatingSelect = (rating: ConditionRatingOption) => {
    const category = rating.category.toLowerCase();
    const gradeField = `${category}Grade`;
    
    // Update the grade value based on the selected rating
    setValues(prev => ({
      ...prev,
      [gradeField]: rating.value
    }));
    
    // Update selected rating
    setSelectedRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ConditionCategory
        title="Exterior Condition"
        description="Rate the overall exterior condition of the vehicle"
      >
        <ConditionSlider
          id="exteriorGrade"
          value={values.exteriorGrade}
          onChange={(value) => handleChange('exteriorGrade', value)}
          min={0}
          max={4}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Salvage</span>
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
        <ConditionTips
          category="Exterior"
          tip={selectedRatings.exterior?.description || ''}
        />
      </ConditionCategory>

      <ConditionCategory
        title="Interior Condition"
        description="Rate the overall interior condition of the vehicle"
      >
        <ConditionSlider
          id="interiorGrade"
          value={values.interiorGrade}
          onChange={(value) => handleChange('interiorGrade', value)}
          min={0}
          max={4}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Salvage</span>
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
        <ConditionTips
          category="Interior"
          tip={selectedRatings.interior?.description || ''}
        />
      </ConditionCategory>

      <ConditionCategory
        title="Mechanical Condition"
        description="Rate the overall mechanical condition of the vehicle"
      >
        <ConditionSlider
          id="mechanicalGrade"
          value={values.mechanicalGrade}
          onChange={(value) => handleChange('mechanicalGrade', value)}
          min={0}
          max={4}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Salvage</span>
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
        <ConditionTips
          category="Mechanical"
          tip={selectedRatings.mechanical?.description || ''}
        />
      </ConditionCategory>

      <ConditionCategory
        title="Title Status"
        description="Select the current title status of the vehicle"
      >
        <Select
          value={values.titleStatus}
          onValueChange={(value) => handleChange('titleStatus', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select title status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Clean">Clean</SelectItem>
            <SelectItem value="Rebuilt">Rebuilt/Reconstructed</SelectItem>
            <SelectItem value="Salvage">Salvage</SelectItem>
            <SelectItem value="Lemon">Lemon Law/Manufacturer Buyback</SelectItem>
            <SelectItem value="Flood">Flood/Water Damage</SelectItem>
          </SelectContent>
        </Select>
      </ConditionCategory>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Update Condition'}
        </Button>
      </div>
    </form>
  );
}
