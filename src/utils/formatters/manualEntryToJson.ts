
/**
 * Converts manual entry form data to JSON format
 * @param formData - The form data to convert
 * @returns JSON formatted data
 */
export const manualEntryToJson = (formData: Record<string, any>): string => {
  try {
    return JSON.stringify(formData, null, 2);
  } catch (error) {
    return '{}';
  }
};
