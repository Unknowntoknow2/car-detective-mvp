
import React from 'react';

// Basic form components for MVP
export const Form = ({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) => (
  <form {...props}>{children}</form>
);

export const FormField = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);

export const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">{children}</div>
);

export const FormControl = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const FormMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-red-600">{children}</div>
);
