
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BodyS } from "./typography";

export type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  motionProps?: Record<string, any>;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">;

export const CDButton: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  iconPosition = "left",
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  ariaLabel,
  motionProps = {},
  ...props
}) => {
  // Map sizes to classes
  const sizeClasses = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-base rounded-md",
    lg: "h-12 px-6 text-base rounded-lg",
  };

  // Map variants to classes
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary/25",
    secondary: "bg-neutral-lighter text-neutral-darkest hover:bg-neutral-light focus:ring-neutral/25",
    ghost: "bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/25",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/10 focus:ring-primary/25",
    danger: "bg-error text-white hover:bg-error-dark focus:ring-error/25"
  };

  // Base classes
  const baseClasses = [
    "inline-flex items-center justify-center",
    "font-medium transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    isLoading ? "relative cursor-wait" : "",
    fullWidth ? "w-full" : "",
  ].join(" ");

  return (
    <motion.button
      type={type}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      aria-label={ariaLabel}
      whileHover={{ scale: isDisabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled || isLoading ? 1 : 0.98 }}
      {...motionProps}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}

      <span
        className={cn(
          "flex items-center gap-2",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      >
        {icon && iconPosition === "left" && <span>{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span>{icon}</span>}
      </span>
    </motion.button>
  );
};

export default CDButton;
