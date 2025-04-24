
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      <h2 className="font-display text-section-header">{title}</h2>
      {description && (
        <p className="text-text-secondary text-small">{description}</p>
      )}
    </div>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info';
}

export function DesignCard({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        variant === 'default' ? 'card' : 'info-card',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  number: number;
  title: string;
  description?: string;
  active?: boolean;
}

export function Step({ number, title, description, active, className, ...props }: StepProps) {
  return (
    <div 
      className={cn(
        'step',
        active && 'text-primary',
        className
      )} 
      {...props}
    >
      <span className={cn('step-number', active && 'bg-primary', !active && 'bg-gray-300')}>
        {number}
      </span>
      <div className="space-y-0.5">
        <h3 className="text-subsection font-medium">{title}</h3>
        {description && (
          <p className="text-text-secondary text-small">{description}</p>
        )}
      </div>
    </div>
  );
}
