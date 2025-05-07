
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type TooltipProps = {
  children: React.ReactNode;
  content?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  skipDelayDuration?: number;
  className?: string;
  contentClassName?: string;
  showArrow?: boolean;
};

export const CDTooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = "top",
  align = "center",
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 300,
  skipDelayDuration = 300,
  className,
  contentClassName,
  showArrow = true,
}) => {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger asChild>
          <span className={className}>{children}</span>
        </TooltipPrimitive.Trigger>
        <AnimatePresence>
          {open && content && (
            <TooltipPrimitive.Portal forceMount>
              <TooltipPrimitive.Content
                asChild
                side={side}
                align={align}
                sideOffset={8}
                alignOffset={0}
              >
                <motion.div
                  className={cn(
                    "z-50 overflow-hidden rounded-md",
                    "bg-neutral-darkest text-white",
                    "px-3 py-1.5 text-sm shadow-md",
                    "border border-neutral-darkest/10",
                    contentClassName
                  )}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {content}
                  {showArrow && (
                    <TooltipPrimitive.Arrow
                      width={10}
                      height={5}
                      className="fill-neutral-darkest"
                    />
                  )}
                </motion.div>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          )}
        </AnimatePresence>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default CDTooltip;
