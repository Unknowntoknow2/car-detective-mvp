
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type TabItem = {
  label: React.ReactNode;
  value: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  tabsClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  variant?: "underline" | "boxed" | "minimal";
  size?: "sm" | "md" | "lg";
  alignment?: "start" | "center" | "end" | "stretch";
  fullWidth?: boolean;
};

export const CDTabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  value: controlledValue,
  onChange,
  className,
  tabsClassName,
  tabClassName,
  contentClassName,
  variant = "underline",
  size = "md",
  alignment = "start",
  fullWidth = false,
}) => {
  // For uncontrolled usage
  const [localValue, setLocalValue] = useState(
    defaultValue || (items.length > 0 ? items[0].value : "")
  );

  // Use controlled value if provided, otherwise use local state
  const activeValue = controlledValue !== undefined ? controlledValue : localValue;

  // Find the active tab
  const activeTab = items.find((item) => item.value === activeValue);

  // Handle tab change
  const handleTabChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setLocalValue(newValue);
    }
    onChange?.(newValue);
  };

  // Variant classes
  const variantClasses = {
    underline: {
      tabs: "border-b border-neutral-light",
      tab: "border-b-2 border-transparent hover:border-neutral-dark [&[data-state=active]]:border-primary",
      indicator: "bg-primary",
    },
    boxed: {
      tabs: "p-1 bg-neutral-lighter rounded-lg",
      tab: "rounded-md [&[data-state=active]]:bg-white [&[data-state=active]]:shadow-sm",
      indicator: "rounded-md bg-white shadow-sm",
    },
    minimal: {
      tabs: "",
      tab: "border-b-2 border-transparent hover:text-primary [&[data-state=active]]:text-primary [&[data-state=active]]:border-none",
      indicator: "bg-transparent",
    },
  };

  // Size classes
  const sizeClasses = {
    sm: "text-sm h-9",
    md: "text-base h-10",
    lg: "text-lg h-12",
  };

  // Alignment classes
  const alignmentClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    stretch: "justify-stretch [&>*]:flex-1",
  };

  // Find the active index for the indicator
  const activeIndex = items.findIndex((item) => item.value === activeValue);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex w-full",
          variantClasses[variant].tabs,
          alignmentClasses[alignment],
          tabsClassName
        )}
      >
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            data-state={item.value === activeValue ? "active" : "inactive"}
            onClick={() => !item.disabled && handleTabChange(item.value)}
            className={cn(
              "relative flex items-center justify-center gap-1.5",
              "px-3 font-medium transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "text-neutral-dark [&[data-state=active]]:text-primary focus:outline-none",
              sizeClasses[size],
              variantClasses[variant].tab,
              tabClassName,
              fullWidth && "flex-1"
            )}
          >
            {item.icon && <span className="size-4">{item.icon}</span>}
            {item.label}
          </button>
        ))}

        {/* Sliding indicator for underline variant */}
        {variant === "underline" && activeIndex !== -1 && (
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 h-0.5 rounded-full",
              variantClasses[variant].indicator
            )}
            initial={false}
            style={{
              width: `calc(100% / ${items.length})`,
            }}
            animate={{
              x: `calc(${activeIndex} * 100%)`,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
      </div>

      <div className={cn("mt-4", contentClassName)}>
        {activeTab?.content}
      </div>
    </div>
  );
};

export default CDTabs;
