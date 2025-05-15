
/**
 * Formats a phone number in US format (XXX) XXX-XXXX
 * @param phone The phone number to format
 * @returns The formatted phone number
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if we have a 10-digit US number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Just return the original number if it doesn't match the expected format
  return phone;
}
