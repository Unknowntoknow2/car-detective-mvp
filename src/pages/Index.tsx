
import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnhancedHeroSection } from "@/components/home/EnhancedHeroSection";
import { EnhancedFeatures } from "@/components/home/EnhancedFeatures";
import { LookupTabs } from "@/components/home/LookupTabs";
import { SectionHeader } from "@/components/ui/design-system";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BadgeCheck, 
  Award, 
  ShieldCheck, 
  BarChart3, 
  FileBarChart, 
  Download,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const lookupRef = useRef<HTMLDivElement>(null);

  const scrollToLookup = () => {
    lookupRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <EnhancedHeroSection onFreeValuationClick={scrollToLookup} />
        <EnhancedFeatures />
        
        {/* How it works section */}
        <section className="py-24 bg-gradient-to-b from-surface-dark to-surface">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="How It Works"
              description="Get a precise vehicle valuation in three simple steps"
              align="center"
              className="mb-16"
            />
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Enter Your Vehicle Details",
                  description: "Provide basic information or your VIN for the most accurate valuation.",
                  icon: <BadgeCheck className="h-8 w-8 text-primary" />
                },
                {
                  step: "2",
                  title: "Our AI Analyzes the Data",
                  description: "We combine real-time market data with advanced algorithmic analysis.",
                  icon: <BarChart3 className="h-8 w-8 text-primary" />
                },
                {
                  step: "3",
                  title: "Receive Your Detailed Report",
                  description: "Get a comprehensive breakdown of your car's value with actionable insights.",
                  icon: <FileBarChart className="h-8 w-8 text-primary" />
                }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-border p-8">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-x-5 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-full translate-x-2 translate-y-6"></div>
                    
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-primary-light flex items-center justify-center mb-6">
                        {step.icon}
                      </div>
                      <div className="absolute top-0 right-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-text-secondary">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                onClick={scrollToLookup}
                size="lg" 
                className="button-3d"
              >
                Get My Car's Value
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Premium Valuation CTA */}
        <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                      Expert-Grade Vehicle Analysis
                    </h2>
                    <p className="text-xl mt-4 text-white/80">
                      Professional valuation report with CARFAX®, market analysis, and predicted future values.
                    </p>
                    
                    <div className="flex items-center gap-2 mt-6 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <span className="font-mono text-2xl font-bold">$29.99</span>
                      <span className="text-white/70 text-sm">Includes $44 CARFAX® Report</span>
                    </div>
                    
                    <ul className="space-y-3 mt-8">
                      {[
                        "Complete Vehicle History",
                        "Comprehensive Market Analysis",
                        "Feature-Based Value Adjustments",
                        "12-Month Value Prediction"
                      ].map((feature, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3"
                        >
                          <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                            <ShieldCheck className="h-3 w-3 text-white" />
                          </div>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <div className="mt-10">
                      <Link to="/premium">
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="border-white text-white hover:bg-white hover:text-primary"
                        >
                          <Award className="mr-2 h-5 w-5" />
                          Get Premium Valuation
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                          <FileBarChart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">Premium Report</h3>
                          <p className="text-xs text-white/70">CARFAX® Integration</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                        <Download className="h-4 w-4 mr-1" />
                        Sample
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-white/60 mb-1">Estimated Value</p>
                        <p className="text-2xl font-bold">$24,750</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-white/60 mb-1">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">92%</span>
                          <BadgeCheck className="h-5 w-5 text-green-300" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-white/60 mb-3">Vehicle Information</p>
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                          <div>
                            <p className="text-white/60">Make/Model</p>
                            <p className="font-mono">Honda Accord</p>
                          </div>
                          <div>
                            <p className="text-white/60">Year</p>
                            <p className="font-mono">2019</p>
                          </div>
                          <div>
                            <p className="text-white/60">Trim</p>
                            <p className="font-mono">EX-L</p>
                          </div>
                          <div>
                            <p className="text-white/60">Mileage</p>
                            <p className="font-mono">42,560</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-white/60 mb-2">CARFAX® Highlights</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <BadgeCheck className="h-4 w-4 text-green-300" />
                            <span>No Accidents</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BadgeCheck className="h-4 w-4 text-green-300" />
                            <span>1 Owner</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BadgeCheck className="h-4 w-4 text-green-300" />
                            <span>Service Records</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Link to="/premium" className="w-full">
                        <Button className="w-full">Get Your Report</Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        <section ref={lookupRef} className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <SectionHeader
              title="Start Your Free Valuation"
              description="Choose your preferred lookup method to get an accurate vehicle valuation"
              align="center"
              className="mb-8"
            />
            <LookupTabs />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
