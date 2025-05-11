
import * as z from 'zod';
import { isValidPhone, validatePassword } from '@/components/auth/forms/signup/validation';

// Define the dealer signup form schema - simplified to avoid deep type instantiation
export const dealerFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine((value) => {
      const result = validatePassword(value);
      return result === '';
    }, 'Password must contain uppercase, lowercase, and numbers'),
  dealershipName: z.string()
    .min(2, 'Dealership name must be at least 2 characters')
    .max(100, 'Dealership name cannot exceed 100 characters'),
  phone: z.string()
    .optional()
    .refine((val) => !val || isValidPhone(val), 'Please enter a valid phone number (e.g. +1234567890)'),
});

// Define the dealer signup data type explicitly to avoid deep type instantiation
export type DealerSignupData = {
  fullName: string;
  email: string;
  password: string;
  dealershipName: string;
  phone?: string;
};
