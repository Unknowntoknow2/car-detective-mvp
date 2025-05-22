
export function ensureNotUndefined<T>(value: T | undefined, defaultValue: T): T {
  return typeof value !== 'undefined' ? value : defaultValue;
}

// Export this helper to be used in other PDF section files
