import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
<<<<<<< HEAD
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
=======

        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
            error && "border-destructive focus-visible:ring-destructive",
            icon && "pl-10",
            trailingIcon && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />

        {trailingIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {trailingIcon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export { Input };
