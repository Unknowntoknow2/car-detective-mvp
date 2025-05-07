import { sum } from '../helpers';

/**
 * Calculates the adjustment based on the presence of premium equipment or features.
 * @param equipment - An array of equipment codes or feature identifiers.
 * @param prices - An object mapping equipment codes to their corresponding price adjustments.
 * @returns The total adjustment value based on the provided equipment.
 */
export const calculateEquipmentAdjustment = (
  equipment: string[],
  prices: { [key: string]: number }
): number => {
  if (!equipment || equipment.length === 0) {
    return 0;
  }

  const validEquipment = equipment.filter(code => prices[code] !== undefined);
  const adjustments = validEquipment.map(code => prices[code]);

  return sum(adjustments);
};

/**
 * Finds the maximum value from a mixed array of numbers and strings,
 * converting strings to numbers where possible.
 * @param mixedValues - An array containing numbers and strings representing numerical values.
 * @returns The largest numerical value found in the array.
 */
export const findMaxValue = (mixedValues: (string | number)[]): number => {
  if (!mixedValues || mixedValues.length === 0) {
    return 0;
  }

  // Convert string values to numbers before using in Math functions
  const numericValues = mixedValues.map(val => typeof val === 'string' ? parseFloat(val) : val);
  const result = Math.max(...numericValues.filter(val => !isNaN(val)));

  return result;
};
