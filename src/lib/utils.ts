
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SHOW_ALL_COMPONENTS } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to ensure components are visible in development mode
export function ensureVisible(isVisible: boolean): boolean {
  return SHOW_ALL_COMPONENTS ? true : isVisible;
}

// For feature-gated content, show in development mode
export function showFeature(featureEnabled: boolean): boolean {
  return SHOW_ALL_COMPONENTS ? true : featureEnabled;
}
