
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp, Star } from "lucide-react";

export const PremiumHeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToValuation = () => {
    const section = document.querySelector('[data-section="valuation"]');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Tesla-Inspired Animated Background */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, hsl(var(--primary) / 0.15) 0%, transparent 50%)`
        }}
      />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Content */}
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium px-4 py-2 rounded-full text-sm mb-8 glass-effect">
              <Star className="w-4 h-4" />
              Professional-Grade Valuation Engine
            </div>

            {/* Hero Headline - Tesla/Apple Style */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none mb-8 bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Know Your Car's
              <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-glow">
                True Value
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              Instant, accurate vehicle valuations powered by real market data and AI technology. 
              <span className="block mt-2 text-primary font-medium">Professional-grade precision in seconds.</span>
            </p>

            {/* CTA Button - Tesla Style */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Button
                size="lg"
                className="btn btn-lg btn-primary group relative overflow-hidden min-w-[280px]"
                onClick={scrollToValuation}
              >
                <span className="relative z-10 flex items-center">
                  Get Instant Valuation
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Shield className="w-4 h-4" />
                Free • No Registration Required
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center p-6 glass-effect rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-muted-foreground">Get precise valuations in under 3 seconds</p>
            </div>
            
            <div className="text-center p-6 glass-effect rounded-2xl">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Data</h3>
              <p className="text-muted-foreground">Real-time analysis of 1M+ vehicle listings</p>
            </div>
            
            <div className="text-center p-6 glass-effect rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Grade</h3>
              <p className="text-muted-foreground">Used by dealers and financial institutions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
