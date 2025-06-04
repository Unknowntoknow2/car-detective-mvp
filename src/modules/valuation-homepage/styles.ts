import { cn } from "@/lib/utils";

/**
 * Car Detective™ Homepage Styles
 * Reusable, merge-safe Tailwind classes
 */

export const container = {
  outer: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  inner: "w-full max-w-6xl mx-auto",
  section: "py-12 md:py-16 lg:py-24",
};

export const hero = {
  wrapper:
    "relative min-h-[80vh] flex items-center justify-center overflow-hidden",
  container: "relative z-10 text-center px-4 py-16 md:py-24",
  tagline:
    "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-4xl mx-auto mb-6",
  subheading: "text-xl md:text-2xl text-neutral-darker max-w-3xl mx-auto mb-10",
  ctaContainer:
    "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6",
  background:
    "absolute inset-0 bg-gradient-to-br from-neutral-lightest to-primary-light/20",
};

export const steps = {
  wrapper: "bg-neutral-lighter py-16 md:py-24",
  heading: "text-3xl md:text-4xl font-bold text-center mb-12",
  grid: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4",
  stepCard: "flex flex-col items-center text-center",
  icon: "mb-4 text-primary p-4 bg-primary-light/20 rounded-full",
  stepTitle: "text-xl font-semibold mb-2",
  stepDescription: "text-neutral-darker",
};

export const trustLogos = {
  wrapper: "py-12 bg-white border-y border-neutral-light",
  container: "max-w-6xl mx-auto px-4",
  heading:
    "text-sm uppercase tracking-wider text-neutral-dark text-center mb-8",
  logoGrid:
    "flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16",
  logo:
    "h-8 md:h-10 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300",
};

export const ctaFooter = {
  wrapper: "bg-primary text-white py-16 md:py-24",
  container: "text-center max-w-4xl mx-auto px-4",
  heading: "text-3xl md:text-4xl font-bold mb-8",
  ctaButton: "inline-block mx-auto mb-6",
  subtext: "text-white/80",
};

export const homeStyles = {
  container,
  hero,
  steps,
  trustLogos,
  ctaFooter,
};

export default homeStyles;
