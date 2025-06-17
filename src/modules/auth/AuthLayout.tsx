
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  quote?: string;
}

export function AuthLayout({ children, title, subtitle, quote }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {title && (
          <div className="text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
            {quote && <blockquote className="text-sm italic text-gray-500 mt-4">"{quote}"</blockquote>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
