<<<<<<< HEAD

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
=======
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  fadeInAnimation,
  shouldReduceMotion,
  slideInAnimation,
} from "@/utils/animations";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Check, ChevronDown, Zap } from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface PremiumHeroProps {
  scrollToForm: () => void;
}

<<<<<<< HEAD
export const PremiumHero: React.FC<PremiumHeroProps> = ({ scrollToForm }) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
      <div className="container flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Unlock Your Vehicle's
          <span className="text-primary block mt-2">True Market Value</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
          Our premium valuation service delivers detailed insights and accurate pricing
          that you can trust when buying, selling, or trading your vehicle.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button size="lg" onClick={scrollToForm} className="gap-2">
            Get Premium Valuation <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Button size="lg" variant="outline" onClick={() => window.open('/how-it-works', '_blank')}>
            Learn How It Works
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          {[
            { label: 'Accuracy Rate', value: '95%' },
            { label: 'Data Points', value: '50M+' },
            { label: 'Valuations', value: '750K+' },
            { label: 'Trusted By', value: '1000+ Dealers' },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</span>
              <span className="text-sm md:text-base text-muted-foreground">{stat.label}</span>
=======
export function PremiumHero({ scrollToForm }: PremiumHeroProps) {
  const reduceMotion = shouldReduceMotion();

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20 pointer-events-none">
      </div>

      {/* Animated Circles */}
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute rounded-full bg-white/10 w-64 h-64 -top-20 -left-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute rounded-full bg-white/5 w-96 h-96 -bottom-40 -right-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
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
            Get dealer-competitive offers, full vehicle history, and pricing
            forecasts with our comprehensive premium valuation tools.
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
