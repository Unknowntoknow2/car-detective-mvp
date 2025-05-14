
import React from 'react';
import { cn } from '@/lib/utils';

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: React.ElementType;
};

export const Heading = ({
  level = 1,
  as,
  className,
  children,
  ...props
}: HeadingProps) => {
  const Tag = (as || `h${level}`) as React.ElementType;

  const styles = {
    1: "text-4xl font-bold tracking-tight",
    2: "text-3xl font-semibold tracking-tight",
    3: "text-2xl font-semibold tracking-tight",
    4: "text-xl font-semibold tracking-tight",
    5: "text-lg font-medium",
    6: "text-base font-medium",
  };

  return (
    <Tag
      className={cn(styles[level], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

// Add these specific heading variants for backward compatibility
export const HeadingXL = (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={1} className="text-5xl" {...props} />;
export const HeadingL = (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={1} {...props} />;
export const HeadingM = (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={2} {...props} />;
export const HeadingS = (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={3} {...props} />;

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement> & {
  size?: "xs" | "sm" | "base" | "lg";
};

export const Paragraph = ({
  size = "base",
  className,
  children,
  ...props
}: ParagraphProps) => {
  const styles = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  };

  return (
    <p
      className={cn(styles[size], className)}
      {...props}
    >
      {children}
    </p>
  );
};

// Add these specific body text variants for backward compatibility
export const BodyL = (props: React.HTMLAttributes<HTMLParagraphElement>) => <Paragraph size="lg" {...props} />;
export const BodyM = (props: React.HTMLAttributes<HTMLParagraphElement>) => <Paragraph size="base" {...props} />;
export const BodyS = (props: React.HTMLAttributes<HTMLParagraphElement>) => <Paragraph size="sm" {...props} />;

export const Caption = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
};

export const Label = ({ className, children, ...props }: React.HTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={cn("text-sm font-medium", className)}
      {...props}
    >
      {children}
    </label>
  );
};

export const Value = ({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("text-base font-medium", className)}
      {...props}
    >
      {children}
    </span>
  );
};

export const Link = ({
  className,
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      href={href}
      className={cn(
        "text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30 rounded",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export const Code = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
};
