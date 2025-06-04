<<<<<<< HEAD

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
=======
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building, KeyRound, Mail, Phone, User } from "lucide-react";

export const FullNameField = ({ form, isLoading }) => (
  <FormField
    control={form.control}
    name="fullName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Full Name</FormLabel>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <FormControl>
            <Input
              placeholder="Your full name"
              className="pl-10"
              {...field}
              disabled={isLoading}
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const DealershipNameField = (
  { form, isLoading, dealershipError, setDealershipError },
) => (
  <FormField
    control={form.control}
    name="dealershipName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Dealership Name</FormLabel>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <FormControl>
            <Input
              placeholder="Your dealership name"
              className="pl-10"
              {...field}
              disabled={isLoading}
              onChange={(e) => {
                field.onChange(e);
                if (dealershipError) setDealershipError("");
              }}
            />
          </FormControl>
        </div>
        {dealershipError
          ? (
            <p className="text-sm font-medium text-destructive">
              {dealershipError}
            </p>
          )
          : <FormMessage />}
      </FormItem>
    )}
  />
);

export const PhoneField = ({ form, isLoading }) => (
  <FormField
    control={form.control}
    name="phone"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Phone (optional)</FormLabel>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <FormControl>
            <Input
              placeholder="Contact phone number"
              type="tel"
              className="pl-10"
              {...field}
              disabled={isLoading}
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const EmailField = ({ form, isLoading }) => (
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <FormControl>
            <Input
              placeholder="Your email address"
              type="email"
              className="pl-10"
              {...field}
              disabled={isLoading}
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);

export const PasswordField = ({ form, isLoading }) => (
  <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Password</FormLabel>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <FormControl>
            <Input
              placeholder="Create a secure password"
              type="password"
              className="pl-10"
              {...field}
              disabled={isLoading}
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
