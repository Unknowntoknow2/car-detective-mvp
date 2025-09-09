import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfessionalButton } from './ProfessionalButton';

interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export function ProfessionalModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
  size = 'md',
  showCloseButton = true
}: ProfessionalModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        'relative bg-background rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto',
        sizeClasses[size],
        'w-full mx-4',
        className
      )}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              {title && (
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              )}
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Step Progress Component
interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ label: string; completed?: boolean }>;
}

export function StepProgress({ currentStep, totalSteps, steps }: StepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={cn(
              'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold',
              index + 1 === currentStep 
                ? 'bg-primary text-primary-foreground border-primary'
                : index + 1 < currentStep || step.completed
                ? 'bg-success text-white border-success'
                : 'bg-muted text-muted-foreground border-muted-foreground'
            )}>
              {step.completed ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-16 h-0.5 mx-2',
                index + 1 < currentStep 
                  ? 'bg-success' 
                  : 'bg-muted-foreground/30'
              )} />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-3">
        {steps.map((step, index) => (
          <div key={index} className="text-xs text-center">
            <span className={cn(
              'font-medium',
              index + 1 === currentStep 
                ? 'text-primary'
                : index + 1 < currentStep 
                ? 'text-success'
                : 'text-muted-foreground'
            )}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Option Card Component
interface OptionCardProps {
  title: string;
  description: string;
  badge?: string;
  recommended?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export function OptionCard({
  title,
  description,
  badge,
  recommended,
  icon,
  onClick,
  className
}: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200',
        'hover:border-primary hover:bg-primary/5 hover:scale-[1.02]',
        recommended 
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-border bg-background',
        className
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Highly Recommended!
          </span>
        </div>
      )}
      
      {badge && !recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Toggle Button Component
interface ToggleButtonProps {
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ToggleButton({ options, value, onChange, className }: ToggleButtonProps) {
  return (
    <div className={cn('flex rounded-lg bg-muted/50 p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
            value === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}