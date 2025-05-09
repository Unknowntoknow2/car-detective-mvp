
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { fadeInAnimation, slideInAnimation, shouldReduceMotion } from '@/utils/animations';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Zap, ChevronDown, Check } from 'lucide-react';

interface PremiumHeroProps {
  scrollToForm: () => void;
}

export function PremiumHero({ scrollToForm }: PremiumHeroProps) {
  const reduceMotion = shouldReduceMotion();
  
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20 pointer-events-none"></div>
      
      {/* Animated Circles */}
      {!reduceMotion && (
        <>
          <motion.div 
            className="absolute rounded-full bg-white/10 w-64 h-64 -top-20 -left-20"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute rounded-full bg-white/5 w-96 h-96 -bottom-40 -right-20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          />
        </>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={reduceMotion ? {} : "hidden"}
            animate={reduceMotion ? {} : "visible"}
            variants={fadeInAnimation}
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 transition-colors">
              Premium Experience
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            initial={reduceMotion ? {} : "hidden"}
            animate={reduceMotion ? {} : "visible"}
            variants={slideInAnimation}
          >
            Advanced Vehicle Valuation & Analytics
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 text-white/90"
            initial={reduceMotion ? {} : "hidden"}
            animate={reduceMotion ? {} : "visible"}
            variants={slideInAnimation}
            transition={{ delay: 0.1 }}
          >
            Get dealer-competitive offers, full vehicle history, and pricing forecasts 
            with our comprehensive premium valuation tools.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={reduceMotion ? {} : "hidden"}
            animate={reduceMotion ? {} : "visible"}
            variants={slideInAnimation}
            transition={{ delay: 0.2 }}
          >
            <AnimatedButton 
              size="lg" 
              className="bg-white text-indigo-700 hover:bg-white/90"
              onClick={scrollToForm}
              scaleOnHover
              iconAnimation="pulse"
            >
              <Zap className="mr-2 h-5 w-5" />
              Try Premium for $29.99
            </AnimatedButton>
            
            <AnimatedButton 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/10"
              iconAnimation="bounce"
            >
              <ChevronDown className="mr-2 h-5 w-5" />
              Learn More
            </AnimatedButton>
          </motion.div>
          
          <motion.div 
            className="mt-10 flex items-center justify-center gap-6 text-sm"
            initial={reduceMotion ? {} : "hidden"}
            animate={reduceMotion ? {} : "visible"}
            variants={fadeInAnimation}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-300" />
              <span>CARFAX® Included</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-300" />
              <span>One-Time Payment</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-300" />
              <span>No Subscription</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
