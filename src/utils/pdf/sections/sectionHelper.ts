
/**
 * Safely converts a value to a string, returning an empty string for undefined/null
 */
export const safeString = (value: string | undefined | null): string => {
  return value || '';
};

/**
 * Ensures a value is defined, using a default value if not
 */
export const withDefault = <T>(value: T | undefined | null, defaultValue: T): T => {
  return value !== undefined && value !== null ? value : defaultValue;
};

/**
 * Safely accesses object properties that might be undefined
 */
export const safeProp = <T, K extends keyof T>(obj: T | undefined | null, key: K, defaultValue: T[K]): T[K] => {
  return obj && obj[key] !== undefined ? obj[key] : defaultValue;
};
