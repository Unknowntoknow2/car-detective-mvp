
import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-3xl">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function ValueDisplay({ 
  label, 
  value, 
  size = 'medium' 
}: { 
  label: string; 
  value: string | number; 
  size?: 'small' | 'medium' | 'large' 
}) {
  const sizeClasses = {
    small: {
      container: 'space-y-0.5',
      label: 'text-xs',
      value: 'text-base font-medium'
    },
    medium: {
      container: 'space-y-1',
      label: 'text-sm',
      value: 'text-lg font-medium'
    },
    large: {
      container: 'space-y-1',
      label: 'text-sm',
      value: 'text-2xl font-bold'
    }
  };
  
  return (
    <div className={sizeClasses[size].container}>
      <p className={`${sizeClasses[size].label} text-muted-foreground`}>{label}</p>
      <p className={sizeClasses[size].value}>{value}</p>
    </div>
  );
}
