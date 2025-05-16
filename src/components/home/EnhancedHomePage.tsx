
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Container } from "@/components/ui/container";
import { KeyFeatures } from "./KeyFeatures";
import { FeaturesOverview } from "./FeaturesOverview";
import { EnhancedFeatures } from "./EnhancedFeatures";
import { Lock } from "lucide-react";
import { useAnimatedInView } from '@/hooks/useAnimatedInView';

export function EnhancedHomePage() {
  // Use our custom hook for animated sections
  const { ref: heroRef, isInView: heroInView } = useAnimatedInView({ delay: 0.2 });
  const { ref: featuresRef, isInView: featuresInView } = useAnimatedInView({ delay: 0.3 });
  const { ref: overviewRef, isInView: overviewInView } = useAnimatedInView({ delay: 0.4 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <Container>
          <div 
            ref={heroRef}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                Know Your Car's True Worth — Backed by AI + CARFAX®
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                $44 value included. Pay once. Sell smart.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Start My Premium Valuation
                </button>
                <div className="bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 flex items-center">
                  <span className="font-semibold text-yellow-800">One-Time • $29.99</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-gray-50">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Military-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">CARFAX® Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Used by 10,000+ sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Secure Checkout by Stripe™</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-16"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Premium Valuation Features</h2>
            <KeyFeatures />
          </motion.div>
        </Container>
      </section>

      {/* AI Photo Scoring Widget Preview */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">AI Photo Condition Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden">
                    <div className="aspect-w-4 aspect-h-3 bg-gray-200 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-tl-lg">
                      {["Good", "Fair", "Great", "Excellent"][i-1]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center mb-2">
                <div className="text-sm font-medium">Overall Condition Score:</div>
                <div className="ml-2 bg-green-100 text-green-800 font-medium px-2 py-0.5 rounded text-sm">
                  Very Good
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                *Condition scoring affects your final valuation. Premium valuations include detailed photo analysis.
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PDF Report Preview */}
      <section className="py-16">
        <Container>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Professional PDF Report</h2>
              <p className="text-gray-600 mb-6">
                Download and share a comprehensive report including title check, photos, 
                forecasts, and detailed valuation breakdown.
              </p>
              <ul className="space-y-2 mb-6">
                {['CARFAX® history summary', 'Market comparison', '12-month value trend', 'Dealer network access'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all shadow hover:shadow-lg">
                Unlock Full Report
              </button>
            </div>
            <div className="md:w-1/2 relative">
              <div className="aspect-w-8.5 aspect-h-11 bg-white rounded-lg shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="absolute inset-0 backdrop-blur-sm"></div>
                  <div className="absolute rotate-45 text-9xl font-bold text-red-200 opacity-30">SAMPLE</div>
                  <Lock className="w-16 h-16 text-gray-400 z-10" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-500 text-white px-4 py-2 rounded-full transform rotate-12 shadow-lg">
                $44 Value!
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 12-Month Forecast Preview */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">12-Month Value Forecast</h2>
            <p className="text-center text-gray-600 mb-10">
              See how your vehicle's value may change over time and find the perfect time to sell.
            </p>
            <div className="bg-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Market Trends</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Your ZIP:</span>
                  <div className="w-20 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    <Lock className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Unlock</span>
                  </div>
                </div>
              </div>
              
              {/* Blurred chart preview */}
              <div className="h-64 backdrop-blur-sm relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-10 h-10 text-gray-400" />
                  <span className="ml-2 font-medium text-gray-500">Premium Feature</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Current</div>
                  <div className="font-bold">$23,450</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">6 Months</div>
                  <div className="font-bold">$22,800</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">12 Months</div>
                  <div className="font-bold">$21,950</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Get Started VIN Lookup Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
              Enter your VIN number, license plate, or vehicle details to begin your premium valuation 
              with CARFAX® report included.
            </p>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col items-center">
                <button className="w-full max-w-md px-6 py-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-lg mb-4">
                  Start My Premium Valuation
                </button>
                <span className="text-sm text-gray-500">One-time payment of $29.99 • Includes $44 CARFAX® report</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Premium vs. Free Comparison */}
      <section 
        ref={overviewRef}
        className="py-16 bg-gray-50"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={overviewInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
            <FeaturesOverview />
          </motion.div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Michael T.",
                role: "Seller",
                car: "2019 Toyota RAV4",
                quote: "The premium report helped me negotiate $2,200 more for my RAV4 than the initial dealer offer."
              },
              {
                name: "Sarah L.",
                role: "Buyer",
                car: "2017 Honda Accord",
                quote: "I used the CARFAX report to avoid a car with undisclosed accident history. Best $30 I've spent."
              },
              {
                name: "Robert K.",
                role: "Dealer",
                car: "Multiple Vehicles",
                quote: "As a small dealership owner, I use this service for all my inventory valuations. The AI condition scoring is spot-on."
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} • {testimonial.car}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Don't Sell Yourself Short</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the complete picture of your vehicle's worth with our comprehensive premium valuation.
            </p>
            <button className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg">
              Start My Premium Valuation — $29.99
            </button>
            <p className="mt-4 text-sm text-gray-500">Includes $44 CARFAX® report • One-time payment</p>
          </div>
        </Container>
      </section>

      {/* Floating CTA for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg z-50">
        <button className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all shadow">
          Start Premium ($29.99)
        </button>
      </div>
    </div>
  );
}
