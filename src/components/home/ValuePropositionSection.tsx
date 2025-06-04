<<<<<<< HEAD

import React from 'react';
import { GaugeCircle, Database, TrendingUp, Calendar } from 'lucide-react';

export function ValuePropositionSection() {
  const features = [
    {
      icon: <GaugeCircle className="h-10 w-10 text-primary" />,
      title: 'Accurate Valuations',
      description: 'Powered by comprehensive market data and advanced algorithms for the most accurate valuations.'
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: 'Comprehensive Data',
      description: 'Integrated with CARFAX®, auction records, and dealer listings for complete market visibility.'
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: 'Market Analysis',
      description: 'Get detailed insights into market trends, price fluctuations, and demand factors.'
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: 'Future Predictions',
      description: 'AI-powered forecasting helps predict your vehicle\'s value over the next 12 months.'
    }
  ];

  return (
    <section className="bg-muted/30 py-16">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose CarDetective</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine powerful data sources, AI analysis, and industry expertise to deliver the most accurate vehicle valuations available.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border rounded-lg p-6 transition-all hover:shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
=======
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Camera, Car, ChartBar, Clock, Database, Shield } from "lucide-react";

export function ValuePropositionSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-b from-surface to-surface-dark">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">
          The Right Solution for Every Need
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Sell Card */}
          <Card className="bg-blue-50 border-blue-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  Sell Smarter, Get More
                </h3>
              </div>

              <p className="text-text-secondary mb-6">
                Unlock the true value of your car with CARFAX®, AI photo scoring
                & real-time market offers.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-text-secondary">
                  <Camera className="h-4 w-4 text-primary mr-2" />
                  <span>AI photo condition analysis</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Shield className="h-4 w-4 text-primary mr-2" />
                  <span>CARFAX® report included ($44 value)</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Database className="h-4 w-4 text-primary mr-2" />
                  <span>Compare dealer offers instantly</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Clock className="h-4 w-4 text-primary mr-2" />
                  <span>12-month resale value prediction</span>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary-hover"
                onClick={() => navigate("/premium")}
              >
                Get Premium Valuation
              </Button>
            </div>
          </Card>

          {/* Buy Card */}
          <Card className="bg-green-50 border-green-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Database className="h-5 w-5 text-success" />
                </div>
                <h3 className="text-xl font-semibold">Buy Confidently</h3>
              </div>

              <p className="text-text-secondary mb-6">
                Avoid overpaying or buying hidden-damage vehicles. Know the real
                worth with AI + CARFAX insights.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-text-secondary">
                  <Shield className="h-4 w-4 text-success mr-2" />
                  <span>Complete vehicle history</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Database className="h-4 w-4 text-success mr-2" />
                  <span>Market price comparison</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Camera className="h-4 w-4 text-success mr-2" />
                  <span>AI condition verification</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Car className="h-4 w-4 text-success mr-2" />
                  <span>Similar listings finder</span>
                </div>
              </div>

              <Button
                className="w-full bg-success hover:bg-success-hover"
                onClick={() => navigate("/lookup/vin")}
              >
                Check a Vehicle's Value
              </Button>
            </div>
          </Card>

          {/* Dealer Card */}
          <Card className="bg-amber-50 border-amber-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-full">
                  <ChartBar className="h-5 w-5 text-warning" />
                </div>
                <h3 className="text-xl font-semibold">Tools for Dealers</h3>
              </div>

              <p className="text-text-secondary mb-6">
                Enterprise-grade valuation, resale forecasting, and trade-in
                insights to close more deals.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-text-secondary">
                  <Shield className="h-4 w-4 text-warning mr-2" />
                  <span>Unlimited premium valuations</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Camera className="h-4 w-4 text-warning mr-2" />
                  <span>AI photo scoring at intake</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Database className="h-4 w-4 text-warning mr-2" />
                  <span>Trade-in valuation tools</span>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <Clock className="h-4 w-4 text-warning mr-2" />
                  <span>Inventory market timing</span>
                </div>
              </div>

              <Button
                className="w-full bg-warning hover:bg-warning-hover"
                onClick={() => navigate("/dealer/signup")}
              >
                Explore Dealer Tools
              </Button>
            </div>
          </Card>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </div>
      </div>
    </section>
  );
}

export default ValuePropositionSection;
