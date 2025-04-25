
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Car, 
  FileBarChart, 
  Zap, 
  Building, 
  ChartBar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  scrollToFeatures: () => void;
  scrollToForm: () => void;
  cardRef: React.RefObject<HTMLDivElement>;
  cardRotation: { x: number; y: number };
}

export function HeroSection({ 
  scrollToFeatures, 
  scrollToForm, 
  cardRef, 
  cardRotation 
}: HeroSectionProps) {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm"
            >
              CARFAX® Report Included ($44 value)
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Premium <span className="text-gradient bg-gradient-primary">Valuation</span><br />
              <span className="text-3xl md:text-4xl font-medium">Beyond Just Numbers</span>
            </h1>
            
            <p className="text-lg text-text-secondary max-w-xl">
              Get the complete picture with our premium valuation service—featuring full CARFAX® history, dealer offers, and 12-month value forecasting for just $29.99.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                size="lg" 
                className="button-3d"
                onClick={scrollToForm}
              >
                Get Premium Valuation
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={scrollToFeatures}
                className="border-primary/30 text-primary hover:bg-primary-light/20"
              >
                See All Features
              </Button>
            </div>
            
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card className="bg-white/50 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Full CARFAX® History</h3>
                    <p className="text-sm text-text-secondary">Complete accident & service records with title verification</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Dealer-Beat Offers</h3>
                    <p className="text-sm text-text-secondary">Compare CarMax, Carvana, and local dealer bids</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute -top-8 right-4 z-20 transform translate-x-0 translate-y-0"
            >
              <Card className="w-full max-w-md border-2 border-primary/20 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-primary flex items-center justify-center">
                      <FileBarChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Premium Analysis</h3>
                      <p className="text-sm text-text-secondary">CARFAX® Integration</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-muted/30 border border-border rounded-lg p-4">
                        <h4 className="text-sm text-text-secondary font-medium mb-1">Estimated Value</h4>
                        <p className="text-2xl font-bold text-primary">$24,350</p>
                      </div>
                      <div className="bg-muted/30 border border-border rounded-lg p-4">
                        <h4 className="text-sm text-text-secondary font-medium mb-1">Confidence</h4>
                        <p className="text-2xl font-bold text-success">95%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Feature Adjustments</span>
                        <span className="font-medium">+$1,240</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-primary rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 border border-border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">CARFAX® Highlights</h4>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Clean
                        </Badge>
                      </div>
                      <ul className="text-sm space-y-1 text-text-secondary">
                        <li className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary" />
                          <span>2 owners, no accidents</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary" />
                          <span>Regular service history</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary" />
                          <span>Clean title verified</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute bottom-8 left-12 z-10"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                ref={cardRef}
                style={{
                  transform: `rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg)`,
                  transition: "transform 0.1s ease-out",
                }}
                className="w-full max-w-sm"
              >
                <Card className="border-2 border-border bg-white/80 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-full bg-green-100 flex items-center justify-center">
                        <ChartBar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Market Forecast</h3>
                        <p className="text-xs text-text-secondary">12-Month Projection</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="h-32 bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                        <p className="text-sm text-text-secondary">Interactive Value Chart</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Best time to sell</span>
                        <span className="font-medium">3 months</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
