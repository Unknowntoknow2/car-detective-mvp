
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

type DealerSignupFormData = {
  fullName: string;
  email: string;
  password: string;
  dealershipName: string;
  phone?: string;
};

// Full Name Field
export const FullNameField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<DealerSignupFormData>,
  isLoading: boolean 
}) => (
  <FormField
    control={form.control}
    name="fullName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Full Name</FormLabel>
        <FormControl>
          <Input 
            placeholder="Enter your full name"
            {...field}
            disabled={isLoading}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

// Dealership Name Field
export const DealershipNameField = ({ 
  form, 
  isLoading, 
  dealershipError,
  setDealershipError 
}: { 
  form: UseFormReturn<DealerSignupFormData>,
  isLoading: boolean,
  dealershipError: string,
  setDealershipError: (error: string) => void
}) => (
  <FormField
    control={form.control}
    name="dealershipName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Dealership Name</FormLabel>
        <FormControl>
          <Input 
            placeholder="Enter your dealership name"
            {...field}
            disabled={isLoading}
            onChange={(e) => {
              field.onChange(e);
              setDealershipError('');
            }}
          />
        </FormControl>
        {dealershipError && (
          <p className="text-sm font-medium text-destructive">{dealershipError}</p>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

// Phone Number Field
export const PhoneField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<DealerSignupFormData>,
  isLoading: boolean 
}) => (
  <FormField
    control={form.control}
    name="phone"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Phone Number (Optional)</FormLabel>
        <FormControl>
          <Input 
            placeholder="Enter phone number (e.g. +1234567890)"
            {...field}
            type="tel"
            disabled={isLoading}
          />
        </FormControl>
        <FormDescription>
          Include country code (e.g. +1 for US)
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

// Email Field
export const EmailField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<DealerSignupFormData>,
  isLoading: boolean 
}) => (
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input 
            type="email"
            placeholder="Enter your email"
            {...field}
            disabled={isLoading}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

// Password Field
export const PasswordField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<DealerSignupFormData>,
  isLoading: boolean 
}) => (
  <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input 
            type="password"
            placeholder="Create a password"
            {...field}
            disabled={isLoading}
          />
        </FormControl>
        <FormDescription>
          Password must contain at least 8 characters, including uppercase, lowercase, and numbers
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
