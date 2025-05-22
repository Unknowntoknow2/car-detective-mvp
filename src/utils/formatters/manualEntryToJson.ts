
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

/**
 * Converts a manual entry form data object to a JSON string
 * @param data Manual entry form data
 * @returns JSON string representation of the data
 */
export function manualEntryToJson(data: ManualEntryFormData): string {
  return JSON.stringify(data);
}
