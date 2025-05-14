
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ 
  level = 2, 
  children, 
  className, 
  ...props 
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag 
      className={cn('font-bold', className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

// Legacy type exports that might be used elsewhere
export const HeadingXL = Heading;
export const HeadingL = Heading;
export const HeadingM = Heading;
export const HeadingS = Heading;

// Body text components
interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Body: React.FC<BodyProps> = ({ 
  children, 
  size = 'medium', 
  className, 
  ...props 
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };
  
  return (
    <p 
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      {children}
    </p>
  );
};

// Legacy exports to maintain compatibility
export const BodyS: React.FC<BodyProps> = (props) => <Body size="small" {...props} />;
export const BodyM: React.FC<BodyProps> = (props) => <Body size="medium" {...props} />;
export const BodyL: React.FC<BodyProps> = (props) => <Body size="large" {...props} />;

// Caption component
interface CaptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const Caption: React.FC<CaptionProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <p 
      className={cn('text-xs text-neutral-dark', className)}
      {...props}
    >
      {children}
    </p>
  );
};

// Label component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <label 
      className={cn('text-sm font-medium', className)}
      {...props}
    >
      {children}
    </label>
  );
};

// Paragraph component
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <p 
      className={cn('text-base leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
};
