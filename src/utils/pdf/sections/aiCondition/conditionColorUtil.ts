
import { rgb, Color } from 'pdf-lib';

/**
 * Determines the appropriate color based on the condition assessment
 */
export function getConditionColor(condition: string | null): Color {
  // Default gray
  let conditionColor = rgb(0.5, 0.5, 0.5);
  
  if (condition === 'Excellent') {
    conditionColor = rgb(0.13, 0.7, 0.3); // Green
  } else if (condition === 'Good') {
    conditionColor = rgb(0.95, 0.7, 0.1); // Yellow/Gold
  } else if (condition === 'Fair' || condition === 'Poor') {
    conditionColor = rgb(0.9, 0.3, 0.2); // Red
  }
  
  return conditionColor;
}
