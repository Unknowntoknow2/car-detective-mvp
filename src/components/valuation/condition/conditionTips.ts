
// Helper function to get improvement tips based on condition rating ID and value
export function getImprovementTips(id: string, value: number): string | undefined {
  // Only provide tips for values below 80 (less than Very Good)
  if (value >= 80) return undefined;
  
  // Exterior-related tips
  if (id === 'exteriorPaint' || id === 'exteriorCondition') {
    if (value < 50) {
      return 'A fresh paint job could significantly increase your vehicle value by up to 5-10%.';
    } else {
      return 'Consider professional detailing to remove scratches and restore shine.';
    }
  }
  
  // Interior-related tips
  if (id === 'interiorCondition' || id === 'seats' || id === 'dashboard') {
    if (value < 50) {
      return 'Consider professional interior cleaning and repairs. This can add 3-7% to your valuation.';
    } else {
      return 'Clean and condition upholstery and surfaces to improve appearance.';
    }
  }
  
  // Mechanical-related tips
  if (id === 'engineCondition' || id === 'transmissionCondition') {
    if (value < 40) {
      return 'Major mechanical issues should be addressed before sale. This could improve value by 15-20%.';
    } else if (value < 70) {
      return 'Have a professional inspection and fix minor issues. Could add 5-10% to value.';
    } else {
      return 'Regular maintenance records can help prove good mechanical condition.';
    }
  }
  
  // Tire-related tips
  if (id === 'tireCondition') {
    if (value < 50) {
      return 'New tires can increase your vehicle value by approximately 3-5%.';
    } else {
      return 'Ensure tires are properly inflated and rotated. Consider tire shine for presentation.';
    }
  }
  
  // General tips for other categories
  if (value < 40) {
    return 'Major improvements needed. Consider professional help to increase value.';
  } else if (value < 70) {
    return 'Minor improvements can significantly increase your vehicle value.';
  } else {
    return 'Small touch-ups could help maximize your vehicle value.';
  }
}
