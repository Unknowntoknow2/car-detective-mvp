
/**
 * Returns descriptive tips for each condition level
 */
export const getConditionTips = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'excellent':
      return 'Vehicle is in exceptional condition with minimal wear. Like-new appearance inside and out with no mechanical issues.';
    case 'very good':
      return 'Vehicle shows minimal wear and tear. Minor cosmetic imperfections but no mechanical issues.';
    case 'good':
      return 'Vehicle shows normal wear for age and mileage. May have minor cosmetic issues and possibly minor mechanical issues that don\'t affect reliability.';
    case 'fair':
      return 'Vehicle has noticeable cosmetic defects and/or mechanical issues that may need attention but is still reliable for regular use.';
    case 'poor':
      return 'Vehicle has significant cosmetic damage and/or mechanical problems that affect reliability and safety.';
    default:
      return 'No specific condition information available.';
  }
};

/**
 * Returns value impact percentage based on condition
 */
export const getConditionValueImpact = (condition: string | undefined): number => {
  if (!condition) return 0;
  
  switch (condition.toLowerCase()) {
    case 'excellent':
      return 5.0;
    case 'very good':
      return 2.5;
    case 'good':
      return 0;
    case 'fair':
      return -2.5;
    case 'poor':
      return -7.5;
    default:
      return 0;
  }
};

/**
 * Returns CSS color class based on condition
 */
export const getConditionColorClass = (condition: string | undefined): string => {
  if (!condition) return 'text-gray-600';
  
  switch (condition.toLowerCase()) {
    case 'excellent':
      return 'text-green-600';
    case 'very good':
    case 'good':
      return 'text-blue-600';
    case 'fair':
      return 'text-amber-600';
    case 'poor':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
