
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label, Caption } from "./typography";

export type InputProps = {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onIconClick?: () => void;
  onTrailingIconClick?: () => void;
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  containerClassName?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export const CDInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      helperText,
      error = false,
      errorMessage,
      icon,
      trailingIcon,
      onIconClick,
      onTrailingIconClick,
      variant = "default",
      size = "md",
      fullWidth = true,
      disabled = false,
      className,
      inputClassName,
      containerClassName,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: "h-8 text-sm px-3",
      md: "h-10 text-base px-4",
      lg: "h-12 text-base px-4",
    };

    // Variant classes
    const variantClasses = {
      default: "border border-neutral-light bg-white focus:border-primary focus:ring-primary/20",
      outline: "border-2 border-neutral-light bg-transparent focus:border-primary focus:ring-primary/10",
      filled: "border border-transparent bg-neutral-lighter focus:bg-white focus:border-primary focus:ring-primary/20",
    };

    // Status classes
    const statusClasses = {
      error:
        "border-error focus:border-error focus:ring-error/20 text-error placeholder:text-error/50",
      disabled: "opacity-60 cursor-not-allowed bg-neutral-lighter text-neutral-dark",
    };

    // Handle icon spacing
    const iconSpacingClasses = {
      leading: icon ? "pl-10" : "",
      trailing: trailingIcon ? "pr-10" : "",
    };

    const id = props.id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div
        className={cn(
          "flex flex-col space-y-2",
          fullWidth ? "w-full" : "w-auto",
          containerClassName
        )}
      >
        {label && (
          <Label className="text-neutral-darkest">
            {label}
          </Label>
        )}

        <div className="relative">
          {icon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark",
                onIconClick && "cursor-pointer hover:text-primary"
              )}
              onClick={onIconClick}
            >
              {icon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-md transition-colors",
              "focus:outline-none focus:ring-2",
              "placeholder:text-neutral-dark",
              sizeClasses[size],
              variantClasses[variant],
              iconSpacingClasses.leading,
              iconSpacingClasses.trailing,
              error ? statusClasses.error : "",
              disabled ? statusClasses.disabled : "",
              inputClassName
            )}
            {...props}
          />

          {trailingIcon && (
            <div
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-dark",
                onTrailingIconClick && "cursor-pointer hover:text-primary"
              )}
              onClick={onTrailingIconClick}
            >
              {trailingIcon}
            </div>
          )}
        </div>

        {(helperText || (error && errorMessage)) && (
          <Caption
            className={cn(
              error ? "text-error" : "text-neutral-dark"
            )}
          >
            {error && errorMessage ? errorMessage : helperText}
          </Caption>
        )}
      </div>
    );
  }
);

CDInput.displayName = "CDInput";

export default CDInput;
