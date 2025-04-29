
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, ChartBar, Shield, FileBarChart } from "lucide-react";
import { DesignCard } from "../ui/design-system";

export function EnhancedHeroSection({ onFreeValuationClick }: { onFreeValuationClick: () => void }) {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      {/* Update the image path to use a relative path that works in the build */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                Know Your Car's{" "}
                <span className="text-gradient bg-gradient-primary">True Value</span>
                <br />
                No More Guesswork!
              </h1>
              <p className="text-xl text-text-secondary max-w-xl">
                Experience precise, data‑driven valuations powered by real‑time market data 
                and expert‑validated AI. Receive an accurate appraisal of your vehicle in seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="button-3d"
                  onClick={onFreeValuationClick}
                >
                  Start Free Valuation
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/premium")}
                  className="border-primary/30 text-primary hover:bg-primary-light/20"
                >
                  Premium Valuation ($29.99)
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {[
                  { icon: <Car className="h-5 w-5" />, label: "Real-Time Market Data" },
                  { icon: <ChartBar className="h-5 w-5" />, label: "Expert Validated AI" },
                  { icon: <Shield className="h-5 w-5" />, label: "CARFAX® Integration" },
                  { icon: <FileBarChart className="h-5 w-5" />, label: "Precise Estimations" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="relative hidden lg:block preserve-3d">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DesignCard 
                variant="premium"
                className="transform rotate-2 shadow-2xl border-primary/20"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <FileBarChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Premium Analysis</h3>
                      <p className="text-sm text-text-secondary">CARFAX® Integration</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-surface-dark/50 border border-border">
                      <h4 className="text-sm font-medium">Estimated Value</h4>
                      <p className="text-2xl font-bold text-primary">$24,350</p>
                    </div>
                    <div className="p-4 rounded-lg bg-surface-dark/50 border border-border">
                      <h4 className="text-sm font-medium">Market Position</h4>
                      <p className="text-2xl font-bold text-success">95%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-primary rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Market Analysis</span>
                      <span>75% Complete</span>
                    </div>
                  </div>
                </div>
              </DesignCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
