
import { cn } from "@/lib/utils";

const styles = {
  // Container styles
  container: cn(
    "max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6"
  ),
  
  // Premium badge
  premiumBadge: cn(
    "inline-flex items-center px-2.5 py-0.5 rounded-full",
    "text-xs font-medium bg-primary-light text-primary",
    "hover:bg-primary-dark/10 transition-colors"
  ),
  
  // Header section
  header: {
    container: cn(
      "bg-white rounded-xl shadow-sm p-4 sm:p-6",
      "border border-neutral-light mb-6",
      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    ),
    vehicleInfo: cn(
      "flex-1"
    ),
    vehicleName: cn(
      "text-2xl sm:text-3xl font-semibold mb-2 flex flex-wrap items-center gap-2"
    ),
    vehicleDetails: cn(
      "flex flex-wrap gap-2"
    ),
    price: cn(
      "text-2xl sm:text-3xl font-bold"
    ),
  },
  
  // Grid layout
  grid: {
    container: cn(
      "grid grid-cols-1 md:grid-cols-2 gap-6"
    ),
    fullWidth: cn(
      "col-span-1 md:col-span-2"
    ),
  },
  
  // Summary section
  summary: {
    container: cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    ),
    itemContainer: cn(
      "p-3 sm:p-4 bg-neutral-lighter rounded-lg"
    ),
  },
  
  // Photo analysis
  photo: {
    container: cn(
      "relative"
    ),
    image: cn(
      "rounded-lg overflow-hidden w-full aspect-video"
    ),
    noPhoto: cn(
      "bg-white rounded-xl shadow-sm p-6",
      "border border-neutral-light",
      "flex flex-col items-center justify-center text-center",
      "min-h-[240px]"
    ),
    scoreContainer: cn(
      "flex items-center justify-between mb-2"
    ),
    scoreBadge: cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium"
    ),
  },
  
  // Breakdown section
  breakdown: {
    container: cn(
      "space-y-3"
    ),
    row: cn(
      "flex justify-between items-center py-2"
    ),
    factor: cn(
      "text-neutral-darker"
    ),
    impact: cn(
      "font-medium"
    ),
    positive: cn(
      "text-success-dark"
    ),
    negative: cn(
      "text-error-dark"
    ),
    neutral: cn(
      "text-neutral-darker"
    ),
  },
  
  // Explanation section
  explanation: {
    container: cn(
      "relative min-h-[180px]"
    ),
    text: cn(
      "text-neutral-darker"
    ),
    premium: {
      blur: cn(
        "absolute inset-0",
        "flex items-center justify-center",
        "bg-white/80 backdrop-blur-sm"
      ),
      button: cn(
        "shadow-md"
      ),
    },
  },
  
  // Mobile-specific classes
  mobile: {
    actionBar: cn(
      "fixed bottom-0 left-0 right-0 bg-white py-3 px-4 border-t border-neutral-light",
      "flex items-center justify-between shadow-md z-20",
      "sm:relative sm:py-0 sm:px-0 sm:border-0 sm:shadow-none sm:z-auto sm:bg-transparent",
      "safe-area-inset"
    ),
    fab: cn(
      "fixed bottom-4 right-4 shadow-lg rounded-full z-20",
      "md:hidden"
    ),
  },
};

export default styles;
