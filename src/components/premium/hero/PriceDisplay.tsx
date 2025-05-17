
import { motion } from "framer-motion";

export function PriceDisplay() {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
      >
        Premium Vehicle Valuations
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-baseline mb-6"
      >
        <span className="text-3xl md:text-4xl font-bold text-primary">$29.99</span>
        <span className="text-gray-500 ml-2">one-time payment</span>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-lg md:text-xl text-gray-600 max-w-xl"
      >
        Get the most comprehensive vehicle valuation with full history reports, dealer offers, and 12-month market forecasts.
      </motion.p>
    </div>
  );
}
