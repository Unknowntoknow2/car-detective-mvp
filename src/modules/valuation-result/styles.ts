
import { cn } from '@/lib/utils';

// Define styles for various components in the valuation result page
const styles = {
  // Main container 
  container: cn(
    "w-full max-w-6xl mx-auto px-4 sm:px-6 py-8"
  ),
  
  // Grid layout for desktop
  grid: {
    container: cn(
      "grid grid-cols-1 md:grid-cols-2 gap-6"
    ),
    fullWidth: cn(
      "col-span-1 md:col-span-2"
    )
  },
  
  // Section styles
  section: {
    card: cn(
      "bg-white rounded-lg shadow-sm border border-neutral-100 p-6"
    ),
    heading: cn(
      "text-xl font-medium text-gray-900 mb-4"
    ),
    subheading: cn(
      "text-sm font-medium text-gray-500 mb-2"
    )
  },
  
  // Header section
  header: {
    container: cn(
      "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    ),
    vehicleInfo: cn(
      "flex flex-col"
    ),
    price: cn(
      "text-3xl font-bold text-primary"
    ),
    vehicleName: cn(
      "text-2xl font-bold text-gray-900"
    ),
    vehicleDetails: cn(
      "flex flex-wrap gap-2 mt-2"
    )
  },
  
  // Score section
  score: {
    container: cn(
      "flex flex-col sm:flex-row items-center justify-between gap-4 mb-6"
    ),
    scoreItem: cn(
      "flex flex-col items-center text-center p-3"
    ),
    confidenceCircle: cn(
      "w-20 h-20 rounded-full border-4 flex items-center justify-center mb-2 text-xl font-bold"
    ),
    priceRange: cn(
      "flex items-center gap-2 text-sm text-gray-600"
    )
  },
  
  // Photo section
  photo: {
    container: cn(
      "relative rounded-lg overflow-hidden"
    ),
    image: cn(
      "w-full h-auto rounded-lg"
    ),
    scoreOverlay: cn(
      "absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium"
    ),
    noPhoto: cn(
      "flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 text-center h-64"
    )
  },
  
  // Breakdown section
  breakdown: {
    container: cn(
      "space-y-4"
    ),
    row: cn(
      "flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
    ),
    factor: cn(
      "text-gray-700"
    ),
    impact: cn(
      "font-medium"
    ),
    positive: cn(
      "text-green-600"
    ),
    negative: cn(
      "text-red-600"
    ),
    neutral: cn(
      "text-gray-700"
    )
  },
  
  // Explanation section
  explanation: {
    container: cn(
      "relative"
    ),
    text: cn(
      "text-gray-700 leading-relaxed"
    ),
    premium: {
      blur: cn(
        "absolute inset-0 backdrop-blur-sm flex items-center justify-center"
      ),
      button: cn(
        "bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition"
      )
    }
  },
  
  // Actions section
  actions: {
    container: cn(
      "flex flex-col sm:flex-row gap-4 mt-6"
    ),
    primaryButton: cn(
      "flex-1"
    ),
    secondaryButton: cn(
      "flex-1"
    )
  },
  
  // Premium badge
  premiumBadge: cn(
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-2"
  ),
  
  // Animation classes
  animation: {
    fadeIn: cn(
      "animate-fade-in"
    ),
    slideIn: cn(
      "animate-slide-in-right"
    ),
    pulse: cn(
      "animate-pulse"
    )
  }
};

export default styles;
