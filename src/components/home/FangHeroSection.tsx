
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
    <section className="relative bg-white py-20 lg:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Value Proposition */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium border border-blue-100">
                  <Shield className="w-4 h-4 mr-2" />
                  Institutional Grade Platform
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-none">
                  Know Your Car's
                  <span className="block bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                    True Value
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Professional vehicle valuations powered by AI and real market data. 
                  Trusted by dealers, lenders, and automotive professionals.
                </p>
              </div>

              {/* Key differentiators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium">30 Second Results</div>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-medium">NADA Compliant</div>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-sm font-medium">Bank-Grade Security</div>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="pt-6">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={scrollToValuation}
                >
                  Get Instant Valuation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Right: Trust Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Live Market Data</h3>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Market Value</span>
                      <span className="text-2xl font-bold text-emerald-600">$28,750</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Confidence Level</span>
                      <span className="text-lg font-semibold text-blue-600">95%</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Processing Time</span>
                      <span className="text-lg font-semibold text-purple-600">23 seconds</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
