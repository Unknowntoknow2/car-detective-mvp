
/**
 * Tailwind CSS classname collections for the Valuation Homepage
 */

const styles = {
  container: {
    inner: "container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl",
    narrow: "container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl"
  },
  
  steps: {
    wrapper: "py-16 bg-gray-50",
    heading: "text-3xl font-bold text-center mb-12",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8 mt-12",
    stepCard: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full",
    stepTitle: "text-xl font-semibold mt-4 mb-2",
    stepDescription: "text-gray-600",
    icon: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary"
  },
  
  trustLogos: {
    wrapper: "py-12 bg-white",
    container: "container mx-auto px-4 max-w-6xl",
    heading: "text-center text-gray-500 mb-8 uppercase text-sm font-medium tracking-wider",
    logoGrid: "flex flex-wrap justify-center items-center gap-8 md:gap-12",
    logo: "h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
  },
  
  ctaFooter: {
    wrapper: "bg-primary text-white py-16",
    container: "container mx-auto px-4 text-center max-w-3xl",
    heading: "text-3xl md:text-4xl font-bold mb-6",
    ctaButton: "px-8 py-3 text-primary bg-white rounded-full shadow-lg hover:shadow-xl transition-all mb-6",
    subtext: "text-primary-foreground/80 mt-4"
  }
};

export default styles;
