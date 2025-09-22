
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target",
  {
    variants: {
      variant: {
        default: "btn-primary shadow-button hover:shadow-button:hover hover-scale",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover-scale",
        outline: "btn-outline shadow-sm hover-scale",
        secondary: "btn-secondary hover-scale",
        ghost: "btn-ghost hover-scale",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        premium: "btn-primary shadow-button hover:shadow-button:hover hover-scale hover-glow",
        accent: "btn-accent shadow-button hover:shadow-button:hover hover-scale"
      },
      size: {
        default: "btn-base",
        sm: "btn-sm",
        lg: "btn-lg",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
