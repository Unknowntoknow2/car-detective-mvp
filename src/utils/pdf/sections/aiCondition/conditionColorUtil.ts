
import { Color, rgb } from 'pdf-lib';

/**
 * Get a color based on vehicle condition
 */
export function getConditionColor(condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null): Color {
  switch (condition) {
    case 'Excellent':
      return rgb(0.13, 0.7, 0.3); // Green
    case 'Good':
      return rgb(0.0, 0.5, 0.8); // Blue
    case 'Fair':
      return rgb(0.9, 0.6, 0.0); // Orange
    case 'Poor':
      return rgb(0.8, 0.2, 0.2); // Red
    default:
      return rgb(0.5, 0.5, 0.5); // Gray (for null or unknown)
  }
}
