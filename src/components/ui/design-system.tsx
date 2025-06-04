<<<<<<< HEAD

import React from 'react';
import { cn } from "@/lib/utils";

export interface DesignCardProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outlined' | 'glass' | 'elevated';
  className?: string;
  title?: string; // Make title optional
=======
import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "./badge";
import { CheckCircle2, ChevronRight } from "lucide-react";

/**
 * Enterprise-grade Section Header Component
 */
const sectionHeaderVariants = cva(
  "space-y-2",
  {
    variants: {
      size: {
        sm: "space-y-1",
        md: "space-y-2",
        lg: "space-y-3",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      variant: {
        default: "",
        gradient: "",
        underline: "border-b pb-4 border-border",
      },
    },
    defaultVariants: {
      size: "md",
      align: "left",
      variant: "default",
    },
  },
);

const titleVariants = cva(
  "font-display tracking-tight",
  {
    variants: {
      size: {
        sm: "text-xl md:text-2xl font-semibold",
        md: "text-2xl md:text-section-header font-semibold",
        lg: "text-3xl md:text-page-title font-bold",
      },
      variant: {
        default: "text-text-primary",
        gradient: "text-gradient",
        underline: "text-text-primary",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export interface SectionHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionHeaderVariants> {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}

export const DesignCard: React.FC<DesignCardProps> = ({ 
  children, 
  variant = 'solid', 
  className,
  title
}) => {
  const variantClasses = {
    'solid': 'bg-card text-card-foreground shadow-sm',
    'outlined': 'border border-border bg-background',
    'glass': 'backdrop-blur-sm bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10',
    'elevated': 'bg-white dark:bg-black shadow-lg'
  };

  return (
    <div className={cn('rounded-lg p-6', variantClasses[variant], className)}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  badge?: string; // Added badge property
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  align = 'left',
  size = 'md',
  className,
  badge
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
<<<<<<< HEAD
    <div className={cn(alignClasses[align], sizeClasses[size], className)}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <h2 className={cn(
          "font-bold tracking-tight",
          size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
        )}>
=======
    <div
      className={cn(sectionHeaderVariants({ size, align, variant }), className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <h2 className={cn(titleVariants({ size, variant }))}>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          {title}
        </h2>
        {badge && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            {badge}
          </span>
        )}
      </div>
      {description && (
<<<<<<< HEAD
        <p className={cn(
          "text-muted-foreground",
          size === 'lg' ? 'text-lg' : 'text-base'
        )}>
=======
        <p
          className={cn(
            "text-text-secondary",
            size === "sm" ? "text-sm" : "text-base",
          )}
        >
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          {description}
        </p>
      )}
    </div>
  );
<<<<<<< HEAD
};
=======
}

/**
 * Enterprise-grade Card Component
 */
const cardVariants = cva(
  "rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "card",
        premium: "card-premium",
        info: "info-card",
        glass: "glass",
        neumorph: "neumorph",
        outline: "bg-white border-border shadow-sm hover:shadow",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

export interface DesignCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  onClick?: () => void;
  isHoverable?: boolean;
}

export function DesignCard({
  variant,
  padding,
  className,
  children,
  onClick,
  isHoverable = false,
  ...props
}: DesignCardProps) {
  return (
    <div
      className={cn(
        cardVariants({ variant, padding }),
        isHoverable && "cursor-pointer hover:translate-y-[-2px]",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Enterprise-grade Step Component
 */
export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  number: number;
  title: string;
  description?: string;
  active?: boolean;
  completed?: boolean;
  isLast?: boolean;
}

export function Step({
  number,
  title,
  description,
  active = false,
  completed = false,
  isLast = false,
  className,
  ...props
}: StepProps) {
  return (
    <div
      className={cn(
        "step relative pb-8",
        active && "step-active",
        completed && "step-completed",
        className,
      )}
      {...props}
    >
      <div className="step-number">
        {completed ? <CheckCircle2 className="h-5 w-5" /> : number}
      </div>

      {!isLast && <div className="step-connector" />}

      <div className="space-y-1 ml-4">
        <h3
          className={cn(
            "text-subsection font-medium",
            active && "text-primary",
            completed && "text-success",
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-text-secondary text-small">{description}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Enterprise Feature Item Component
 */
export interface FeatureItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureItem({
  icon,
  title,
  description,
  className,
  ...props
}: FeatureItemProps) {
  return (
    <div className={cn("flex items-start gap-4", className)} {...props}>
      <div className="mt-0.5 flex-shrink-0 rounded-full bg-primary-light p-2 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="mt-1 text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

/**
 * Enterprise Breadcrumb Path
 */
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    label: string;
    href?: string;
  }[];
}

export function BreadcrumbPath(
  { items, className, ...props }: BreadcrumbProps,
) {
  return (
    <div
      className={cn("flex items-center text-sm text-text-secondary", className)}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="mx-2 h-4 w-4 text-text-tertiary" />
          )}
          {item.href && index !== items.length - 1
            ? (
              <a
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            )
            : (
              <span
                className={index === items.length - 1
                  ? "font-medium text-text-primary"
                  : ""}
              >
                {item.label}
              </span>
            )}
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Enterprise Statistic Card
 */
export interface StatisticProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  trend?: {
    value: number;
    label?: string;
    isUpward?: boolean;
  };
  icon?: React.ReactNode;
}

export function Statistic({
  value,
  label,
  trend,
  icon,
  className,
  ...props
}: StatisticProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-white border border-border shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-text-secondary text-sm">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>

          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isUpward ? "text-success" : "text-error",
                )}
              >
                {trend.isUpward ? "+" : ""}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="text-xs text-text-tertiary ml-1">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
