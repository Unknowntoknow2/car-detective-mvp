
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({ 
  level = 2, 
  children, 
  className, 
  ...props 
}, ref) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return React.createElement(Tag, {
    className: cn('font-bold', className),
    ref,
    ...props
  }, children);
});

Heading.displayName = 'Heading';

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

export const Body = forwardRef<HTMLParagraphElement, BodyProps>(({ 
  children, 
  size = 'medium', 
  className, 
  ...props 
}, ref) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };
  
  return (
    <p 
      ref={ref}
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      {children}
    </p>
  );
});

Body.displayName = 'Body';

// Legacy exports to maintain compatibility
export const BodyS: React.FC<BodyProps> = (props) => <Body size="small" {...props} />;
export const BodyM: React.FC<BodyProps> = (props) => <Body size="medium" {...props} />;
export const BodyL: React.FC<BodyProps> = (props) => <Body size="large" {...props} />;

// Caption component
interface CaptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const Caption = forwardRef<HTMLParagraphElement, CaptionProps>(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <p 
      ref={ref}
      className={cn('text-xs text-neutral-dark', className)}
      {...props}
    >
      {children}
    </p>
  );
});

Caption.displayName = 'Caption';

// Label component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <label 
      ref={ref}
      className={cn('text-sm font-medium', className)}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';

// Paragraph component
interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(({ 
  children, 
  className, 
  ...props 
}, ref) => {
  return (
    <p 
      ref={ref}
      className={cn('text-base leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
});

Paragraph.displayName = 'Paragraph';
