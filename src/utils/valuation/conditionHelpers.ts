
/**
 * Helper functions for vehicle condition-related operations
 */

// Map condition to value impact percentages
export const getConditionValueImpact = (condition: string): number => {
  const conditionMap: Record<string, number> = {
    'Excellent': 10,
    'Very Good': 5,
    'Good': 0,
    'Fair': -5,
    'Poor': -15,
    // Add fallbacks for different casing or alternative condition names
    'excellent': 10,
    'very good': 5,
    'good': 0,
    'fair': -5,
    'poor': -15
  };
  
  return conditionMap[condition] || 0;
};

// Map condition to color classes for UI
export const getConditionColorClass = (condition: string): string => {
  const conditionColorMap: Record<string, string> = {
    'Excellent': 'text-green-600',
    'Very Good': 'text-green-500',
    'Good': 'text-blue-500',
    'Fair': 'text-yellow-500',
    'Poor': 'text-red-500',
    // Add fallbacks for different casing or alternative condition names
    'excellent': 'text-green-600',
    'very good': 'text-green-500',
    'good': 'text-blue-500',
    'fair': 'text-yellow-500',
    'poor': 'text-red-500'
  };
  
  return conditionColorMap[condition] || 'text-gray-500';
};

// Get condition tips based on condition level
export const getConditionTips = (condition: string): string => {
  const conditionTipsMap: Record<string, string> = {
    'Excellent': 'Vehicle is in exceptional condition with minimal wear.',
    'Very Good': 'Vehicle shows minor signs of wear but is well maintained.',
    'Good': 'Vehicle has normal wear for its age and mileage.',
    'Fair': 'Vehicle has noticeable wear and may need minor repairs.',
    'Poor': 'Vehicle shows significant wear and likely needs repairs.',
    // Add fallbacks for different casing or alternative condition names
    'excellent': 'Vehicle is in exceptional condition with minimal wear.',
    'very good': 'Vehicle shows minor signs of wear but is well maintained.',
    'good': 'Vehicle has normal wear for its age and mileage.',
    'fair': 'Vehicle has noticeable wear and may need minor repairs.',
    'poor': 'Vehicle shows significant wear and likely needs repairs.'
  };
  
  return conditionTipsMap[condition] || 'No tips available for this condition.';
};
