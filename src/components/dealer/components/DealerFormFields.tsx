
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { DealerFormData } from '@/types/dealer-schema';

export const FullNameField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<any>; 
  isLoading: boolean 
}) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <Label htmlFor="fullName">Full Name</Label>
      </div>
      <Input
        id="fullName"
        type="text"
        disabled={isLoading}
        {...form.register('fullName', {
          required: 'Full name is required',
        })}
      />
      {form.formState.errors.fullName && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState.errors.fullName.message?.toString()}
        </p>
      )}
    </div>
  );
};

export const DealershipNameField = ({ 
  form, 
  isLoading, 
  dealershipError, 
  setDealershipError 
}: { 
  form: UseFormReturn<any>; 
  isLoading: boolean;
  dealershipError: string | null;
  setDealershipError: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <Label htmlFor="dealershipName">Dealership Name</Label>
      </div>
      <Input
        id="dealershipName"
        type="text"
        disabled={isLoading}
        {...form.register('dealershipName', {
          required: 'Dealership name is required',
          onChange: () => dealershipError && setDealershipError(null),
        })}
      />
      {(form.formState.errors.dealershipName || dealershipError) && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState.errors.dealershipName?.message?.toString() || dealershipError}
        </p>
      )}
    </div>
  );
};

export const PhoneField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<any>; 
  isLoading: boolean 
}) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <Label htmlFor="phone">Phone Number</Label>
      </div>
      <Input
        id="phone"
        type="tel"
        disabled={isLoading}
        {...form.register('phone', {
          required: 'Phone number is required',
          pattern: {
            value: /^[0-9-+()]*$/,
            message: 'Please enter a valid phone number',
          },
        })}
      />
      {form.formState.errors.phone && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState.errors.phone.message?.toString()}
        </p>
      )}
    </div>
  );
};

export const EmailField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<any>; 
  isLoading: boolean 
}) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <Label htmlFor="email">Email</Label>
      </div>
      <Input
        id="email"
        type="email"
        disabled={isLoading}
        {...form.register('email', {
          required: 'Email is required',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Please enter a valid email address',
          },
        })}
      />
      {form.formState.errors.email && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState.errors.email.message?.toString()}
        </p>
      )}
    </div>
  );
};

export const PasswordField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<any>; 
  isLoading: boolean 
}) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <Label htmlFor="password">Password</Label>
      </div>
      <Input
        id="password"
        type="password"
        disabled={isLoading}
        {...form.register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        })}
      />
      {form.formState.errors.password && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState.errors.password.message?.toString()}
        </p>
      )}
    </div>
  );
};

export const ContactNameField = ({ 
  form, 
  isLoading 
}: { 
  form: UseFormReturn<any>; 
  isLoading: boolean 
}) => {
  return (
    <div className="mb-4">
      <div className="mb-2">
        <Label htmlFor="contactName">Contact Name</Label>
      </div>
      <Input
        id="contactName"
        type="text"
        disabled={isLoading}
        {...form.register('contactName', {
          required: 'Contact name is required',
        })}
      />
      {form.formState.errors.contactName && (
        <p className="text-sm text-red-500 mt-1">
          {form.formState.errors.contactName.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default {
  FullNameField,
  DealershipNameField,
  PhoneField,
  EmailField,
  PasswordField,
  ContactNameField
};
