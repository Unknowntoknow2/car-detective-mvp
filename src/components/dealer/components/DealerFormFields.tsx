
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Building, Mail, User, Phone, KeyRound } from 'lucide-react';

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

export const DealershipNameField = ({ form, isLoading, dealershipError, setDealershipError }) => (
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
                if (dealershipError) setDealershipError('');
              }}
            />
          </FormControl>
        </div>
        {dealershipError ? (
          <p className="text-sm font-medium text-destructive">{dealershipError}</p>
        ) : (
          <FormMessage />
        )}
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
