import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

<<<<<<< HEAD
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

=======
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
<<<<<<< HEAD
          "bg-amber-500 text-white hover:bg-amber-600 border border-amber-300",
=======
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
<<<<<<< HEAD
=======
      state: {
        loading: "",
        success: "",
        error: "",
      },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
<<<<<<< HEAD
  }
=======
  },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
<<<<<<< HEAD
  ({ className, variant, size, asChild = false, isLoading, loadingText, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
=======
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      loadingText,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading
          ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingText || "Loading..."}
            </>
          )
          : children}
      </Comp>
    );
<<<<<<< HEAD
  }
=======
  },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
);
Button.displayName = "Button";

export { Button, buttonVariants };
