
import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'default' | 'small' | 'large';
}

export function Container({ 
  children, 
  className, 
  size = 'default', 
  ...props 
}: ContainerProps) {
  return (
    <div 
      className={cn(
        'mx-auto w-full px-4 sm:px-6', 
        {
          'max-w-7xl': size === 'default',
          'max-w-5xl': size === 'small',
          'max-w-screen-2xl': size === 'large'
        },
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
