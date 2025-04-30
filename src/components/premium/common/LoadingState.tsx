
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoadingStateProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "overlay" | "inline";
  className?: string;
}

export function LoadingState({ 
  text = "Loading...", 
  size = "md", 
  variant = "default",
  className = ""
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const variantClasses = {
    default: "flex flex-col items-center justify-center p-8 text-center",
    overlay: "absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all duration-300",
    inline: "flex items-center gap-2.5"
  };

  // Framer motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={cn(variantClasses[variant], className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={childVariants}>
        <Loader2 
          className={cn(
            sizeClasses[size], 
            "text-primary animate-spin drop-shadow-sm", 
            variant !== "inline" ? "mb-3" : ""
          )} 
        />
      </motion.div>
      {text && (
        <motion.p 
          variants={childVariants}
          className={cn(
            "text-slate-700 font-medium",
            variant === "inline" && size === "sm" ? "text-sm" : "",
            size === "lg" && "text-base"
          )}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
