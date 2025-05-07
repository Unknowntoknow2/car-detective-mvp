
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  onClick?: () => void;
  motionProps?: Record<string, any>;
};

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

type CardBodyProps = {
  children: React.ReactNode;
  className?: string;
};

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export const CDCard: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  padding = "md",
  interactive = false,
  onClick,
  motionProps = {},
}) => {
  // Map variants to classes
  const variantClasses = {
    default: "bg-white border border-neutral-light shadow-sm",
    outline: "bg-transparent border border-neutral-light",
    elevated: "bg-white border border-neutral-light shadow-md",
  };

  // Map padding to classes
  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };
  
  if (interactive) {
    return (
      <motion.button
        className={cn(
          "rounded-lg overflow-hidden w-full transition duration-200",
          variantClasses[variant],
          paddingClasses[padding],
          "cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/25",
          className
        )}
        onClick={onClick}
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        {...motionProps}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.div
      className={cn(
        "rounded-lg overflow-hidden w-full transition duration-200",
        variantClasses[variant],
        paddingClasses[padding],
        interactive === false && "shadow-sm hover:shadow-md",
        className
      )}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export const CDCardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("mb-4 pb-3 border-b border-neutral-light", className)}>
      {children}
    </div>
  );
};

export const CDCardBody: React.FC<CardBodyProps> = ({
  children,
  className,
}) => {
  return <div className={cn("", className)}>{children}</div>;
};

export const CDCardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("mt-4 pt-3 border-t border-neutral-light", className)}>
      {children}
    </div>
  );
};

export default CDCard;
