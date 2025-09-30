import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

// Provider & Root
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;

// Trigger
export const TooltipTrigger = TooltipPrimitive.Trigger;

// Content
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, side = 'top', sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      side={side}
      sideOffset={sideOffset}
      className={cn(
        // Use design tokens (no hardcoded colors)
        'z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
        // Smooth entrance animation from our utilities
        'animate-fade-in',
        className
      )}
      {...props}
    >
      {props.children}
      <TooltipPrimitive.Arrow className="fill-border" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = 'TooltipContent';
