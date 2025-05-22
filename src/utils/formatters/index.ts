
import { formatCurrency } from './formatCurrency';
import { formatDate } from './formatDate';
import { formatNumber } from './formatNumber';
import { formatRelativeTime } from './formatRelativeTime';

// Export all formatters
export {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime
};

// Utility function to convert manual entry form data to JSON
export const manualEntryToJson = (formData: any) => {
  return {
    make: formData.make || '',
    model: formData.model || '',
    year: parseInt(formData.year) || new Date().getFullYear(),
    mileage: parseInt(formData.mileage) || 0,
    condition: formData.condition || 'good',
    zipCode: formData.zipCode || '',
    // Additional fields
    color: formData.color || '',
    transmission: formData.transmission || 'automatic',
    fuelType: formData.fuelType || 'gasoline',
    bodyType: formData.bodyType || '',
    features: formData.features || []
  };
};
