
import React, { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "framer-motion";

// Import the new components
import { AiAssistantPreview } from "./AiAssistantPreview";
import { PhotoScoringWidget } from "./PhotoScoringWidget";
import { MarketSnapshot } from "./MarketSnapshot";
import { EnhancedTestimonialsCarousel } from "./EnhancedTestimonialsCarousel";
import { PdfPreview } from "./PdfPreview";

export function EnhancedHomePage() {
  // Hero section animations with useInView
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Features section animations
  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Tools section animations
  const { ref: toolsRef, inView: toolsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Premium section animations
  const { ref: premiumRef, inView: premiumInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-b from-surface-light to-white pt-16 pb-16 md:pb-24"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-photo/close-up-hand-holding-car-figurine_23-2148957840.jpg?w=1380&t=st=1715606000~exp=1715606600~hmac=c0ee8dc87103fbb9c9e9514ed3aac0e97b7da8acb2cca1efe14e000e9c3fce45')",
          }}
        ></div>
        
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto relative z-10"
          >
            <Badge className="mb-4 py-1 px-3 bg-primary-light/30 text-primary">
              AI-Powered Valuation
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-4">
              Know Your Car's True Worth — Backed by AI + CARFAX®
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-3xl mx-auto">
              $44 value included. Pay once. Sell smart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/valuation">
                <Button size="lg" className="w-full sm:w-auto">
                  Start My Premium Valuation
                </Button>
              </Link>
              <Badge className="text-lg py-2 px-4 bg-surface border border-border/50">
                One-Time • $29.99
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Card className="bg-surface-light border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">🚘</div>
                    <h3 className="font-medium">True Value Report</h3>
                    <p className="text-sm text-text-secondary">
                      Get your car's verified worth
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface-light border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">📸</div>
                    <h3 className="font-medium">AI Photo Analysis</h3>
                    <p className="text-sm text-text-secondary">
                      Verify condition with photos
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface-light border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-3xl mb-2">🧾</div>
                    <h3 className="font-medium">CARFAX® Included</h3>
                    <p className="text-sm text-text-secondary">$44 value free</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white" ref={featuresRef}>
        <Container>
          <div className="text-center mb-12">
            <Badge className="mb-2 py-1 px-3 bg-primary-light/30 text-primary">
              Premium Features
            </Badge>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Everything You Need to Maximize Value
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Our premium valuation gives you the complete picture with tools used
              by professional dealerships
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AiAssistantPreview />
            <PdfPreview />
          </motion.div>
        </Container>
      </section>

      {/* Tools Section */}
      <section className="py-16 bg-surface-light" ref={toolsRef}>
        <Container>
          <div className="text-center mb-12">
            <Badge className="mb-2 py-1 px-3 bg-primary-light/30 text-primary">
              AI-Powered Tools
            </Badge>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Intelligent Analysis for Better Decisions
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Our AI analyzes photos, market data, and vehicle history to give you
              the most accurate valuation
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={toolsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <PhotoScoringWidget />
            <MarketSnapshot />
          </motion.div>
        </Container>
      </section>

      {/* Enhanced Testimonials Carousel (replacing the old static section) */}
      <EnhancedTestimonialsCarousel />

      {/* Premium Features Section */}
      <section className="py-16 bg-surface-light" ref={premiumRef}>
        <Container>
          <div className="text-center mb-12">
            <Badge className="mb-2 py-1 px-3 bg-primary-light/30 text-primary">
              Premium vs Free
            </Badge>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Why Go Premium?
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              See what you're missing with our free basic valuation
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={premiumInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-x-auto pb-6"
          >
            <div className="min-w-[768px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left">Features</th>
                    <th className="p-4 text-center bg-muted rounded-tl-lg">
                      <span className="block font-medium text-lg">Free</span>
                      <span className="text-sm text-muted-foreground">Basic Report</span>
                    </th>
                    <th className="p-4 text-center bg-primary/10 rounded-tr-lg">
                      <span className="block font-bold text-lg text-primary">Premium</span>
                      <span className="text-sm text-primary/70">Complete Analysis</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium">Basic Valuation Estimate</td>
                    <td className="p-4 text-center">✓</td>
                    <td className="p-4 text-center bg-primary/5">✓</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium">VIN Decoding</td>
                    <td className="p-4 text-center">✓</td>
                    <td className="p-4 text-center bg-primary/5">✓</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium">CARFAX® Vehicle History ($44 value)</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center bg-primary/5">✓</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium">AI Photo Condition Analysis</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center bg-primary/5">✓</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium">12-Month Value Forecast</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center bg-primary/5">✓</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium">Detailed PDF Report</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center bg-primary/5">✓</td>
                  </tr>
                  <tr className="border-b border-border/30">
                    <td className="p-4 font-medium">Dealer Offers</td>
                    <td className="p-4 text-center">—</td>
                    <td className="p-4 text-center bg-primary/5">✓</td>
                  </tr>
                  <tr>
                    <td className="p-4"></td>
                    <td className="p-4 text-center rounded-bl-lg bg-muted">
                      <Link to="/valuation/basic">
                        <Button variant="outline" size="sm">
                          Start Free
                        </Button>
                      </Link>
                    </td>
                    <td className="p-4 text-center rounded-br-lg bg-primary/10">
                      <Link to="/valuation">
                        <Button size="sm">
                          Get Premium
                        </Button>
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-white border-t border-border/20">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <p className="text-lg font-medium mb-1">
                Trusted by 10,000+ vehicle sellers
              </p>
              <p className="text-sm text-text-secondary">
                Secure, reliable, and accurate valuations
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center">
                <img 
                  src="/logos/carfax.png" 
                  alt="CARFAX Partner" 
                  className="h-8 object-contain opacity-80"
                />
              </div>
              <div className="flex items-center">
                <img 
                  src="/logos/stripe.png" 
                  alt="Stripe Secure Payments" 
                  className="h-8 object-contain opacity-80"
                />
              </div>
              <div className="flex items-center">
                <img 
                  src="/logos/military.png" 
                  alt="Military-Grade Security" 
                  className="h-8 object-contain opacity-80"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Persistent Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 md:hidden">
        <Link to="/valuation">
          <Button className="w-full">
            Start Premium ($29.99)
          </Button>
        </Link>
        <p className="text-xs text-center text-muted-foreground mt-1">
          Includes $44 CARFAX® Report
        </p>
      </div>
    </div>
  );
}
