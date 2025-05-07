
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and then processes them with tailwind-merge
 * to handle Tailwind CSS class conflicts properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
