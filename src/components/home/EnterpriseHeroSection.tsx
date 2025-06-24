
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, BarChart3, Zap, CheckCircle } from "lucide-react";

interface EnterpriseHeroSectionProps {
  onFreeValuationClick?: () => void;
}

export const EnterpriseHeroSection: React.FC<EnterpriseHeroSectionProps> = ({
  onFreeValuationClick,
}) => {
  const scrollToLookup = () => {
    const lookupSection = document.querySelector('[data-section="lookup"]');
    if (lookupSection) {
      lookupSection.scrollIntoView({ behavior: 'smooth' });
    } else if (onFreeValuationClick) {
      onFreeValuationClick();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Sophisticated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`
        }} />
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Enterprise Security Certified
                </Badge>
                
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-none">
                  <span className="block text-white">Institutional-Grade</span>
                  <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Vehicle Intelligence
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl">
                  AI-powered vehicle valuations trusted by automotive professionals, 
                  financial institutions, and enterprise clients across North America.
                </p>
              </div>

              {/* Key benefits with industry-backed metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Market-Leading Accuracy</div>
                    <div className="text-sm text-slate-400">NADA Standards Compliant</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Real-Time Processing</div>
                    <div className="text-sm text-slate-400">Enterprise SLA</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Security Certified</div>
                    <div className="text-sm text-slate-400">Financial-Grade Protection</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300"
                  onClick={scrollToLookup}
                >
                  Start Professional Valuation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 font-semibold px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                >
                  View Enterprise Solutions
                </Button>
              </div>

              {/* Trust indicators with industry certifications */}
              <div className="pt-8 border-t border-slate-700">
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                    NADA Member Standards
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                    GDPR & CCPA Compliant
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                    Enterprise SLA Available
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative lg:pl-8">
              <div className="relative">
                {/* Main card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">Live Market Intelligence</h3>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-slate-300">Market Valuation</span>
                        <span className="text-2xl font-bold text-emerald-400">$28,750</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-slate-300">Data Confidence</span>
                        <span className="text-lg font-semibold text-blue-400">High</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-slate-300">Market Position</span>
                        <span className="text-lg font-semibold text-emerald-400 flex items-center">
                          Above Average <ArrowRight className="w-4 h-4 ml-1 rotate-[-45deg]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-80 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-60 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
