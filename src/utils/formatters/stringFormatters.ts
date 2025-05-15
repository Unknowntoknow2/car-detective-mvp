
/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncates a string to the specified length and adds ellipsis if needed
 */
export function truncate(str: string, length: number = 50): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Formats a string as title case (capitalize each word)
 */
export function titleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(capitalize).join(' ');
}
