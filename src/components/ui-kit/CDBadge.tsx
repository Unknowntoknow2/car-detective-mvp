
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type BadgeProps = {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error" | "neutral" | "primary";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  className?: string;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  motionProps?: Record<string, any>;
};

export const CDBadge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  rounded = false,
  className,
  icon,
  removable = false,
  onRemove,
  motionProps = {},
}) => {
  // Variant classes
  const variantClasses = {
    primary: "bg-primary-light text-primary border border-primary/10",
    info: "bg-info-light text-info-dark border border-info/10",
    success: "bg-success-light text-success-dark border border-success/10",
    warning: "bg-warning-light text-warning-dark border border-warning/10",
    error: "bg-error-light text-error-dark border border-error/10",
    neutral: "bg-neutral-lighter text-neutral-darker border border-neutral-light",
  };

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center justify-center gap-1.5",
        "font-medium transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        rounded ? "rounded-full" : "rounded-md",
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      {...motionProps}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          className="ml-1 -mr-1 h-4 w-4 rounded-full hover:bg-neutral-darkest/10 inline-flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label="Remove badge"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  );
};

export default CDBadge;
