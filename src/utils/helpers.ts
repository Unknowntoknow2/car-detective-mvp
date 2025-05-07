
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID
 * @returns A unique ID string
 */
export function generateUniqueId(): string {
  return uuidv4();
}

/**
 * Truncate a string to a specified length
 * @param str The string to truncate
 * @param maxLength The maximum length
 * @returns The truncated string with ellipsis if needed
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Capitalize the first letter of a string
 * @param str The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
