
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Award } from "lucide-react";

export const FangHeroSection: React.FC = () => {
  const scrollToValuation = () => {
    const section = document.querySelector('[data-section="valuation"]');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 container mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Value Proposition */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
                  <Shield className="w-4 h-4 mr-2" />
                  Institutional Grade Platform
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none">
                  Know Your Car's
                  <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    True Value
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Professional vehicle valuations powered by AI and real market data. 
                  Trusted by dealers, lenders, and automotive professionals.
                </p>
              </div>

              {/* Key differentiators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-sm font-medium">30 Second Results</div>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-sm font-medium">NADA Compliant</div>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-medium">Bank-Grade Security</div>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="pt-6">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  onClick={scrollToValuation}
                >
                  Get Instant Valuation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Right: Trust Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Live Market Data</h3>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-gray-300">Market Value</span>
                      <span className="text-2xl font-bold text-emerald-400">$28,750</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-gray-300">Confidence Level</span>
                      <span className="text-lg font-semibold text-blue-400">95%</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-300">Processing Time</span>
                      <span className="text-lg font-semibold text-purple-400">23 seconds</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-60 blur-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl opacity-40 blur-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
