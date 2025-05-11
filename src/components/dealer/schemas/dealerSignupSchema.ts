
import { z } from 'zod';

export const dealerFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dealershipName: z.string().min(2, 'Dealership name is required'),
  phone: z.string().optional(),
});

// ✅ Manually define the type to avoid deep Zod inference
export type DealerSignupData = {
  fullName: string;
  email: string;
  password: string;
  dealershipName: string;
  phone?: string;
};
