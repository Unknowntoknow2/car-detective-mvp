<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Car, FileCheck, Receipt, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
=======
import {
  Building,
  Camera,
  Car,
  ChartBar,
  FileBarChart,
  FileClock,
  FileText,
  Search,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/design-system";

interface ServiceItem {
  icon: JSX.Element;
  title: string;
  impact: string;
  isPremium: boolean;
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export function PremiumServicesGrid() {
  const premiumServices = [
    {
<<<<<<< HEAD
      title: 'CARFAX® History Report',
      description: 'Full vehicle history including accidents, service records, and previous owners.',
      icon: <Shield className="h-10 w-10 text-primary" />,
      badge: 'Popular',
      link: '/premium'
    },
    {
      title: 'Market Comparison',
      description: 'Compare your car to similar vehicles in your area to see how it stacks up.',
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      badge: null,
      link: '/premium'
    },
    {
      title: 'Dealership Offers',
      description: 'Get real offers from local dealerships interested in your vehicle.',
      icon: <Receipt className="h-10 w-10 text-primary" />,
      badge: 'New',
      link: '/premium'
    },
    {
      title: 'Detailed PDF Report',
      description: 'Comprehensive valuation report that you can download, print, or share.',
      icon: <FileCheck className="h-10 w-10 text-primary" />,
      badge: null,
      link: '/premium'
    }
  ];

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Premium Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlock detailed insights and professional-grade tools with our premium services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumServices.map((service, index) => (
            <Card key={index} className="border-primary/10 hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  {service.icon}
                  {service.badge && (
                    <Badge variant="secondary">{service.badge}</Badge>
                  )}
=======
      icon: <Car className="h-5 w-5 text-primary" />,
      title: "VIN/Plate/Manual Lookup",
      impact: "Base Service",
      isPremium: false,
    },
    {
      icon: <Camera className="h-5 w-5 text-green-600" />,
      title: "Multi-Photo AI Scoring",
      impact: "+15% Accuracy",
      isPremium: true,
    },
    {
      icon: <Building className="h-5 w-5 text-orange-500" />,
      title: "Dealer-Beat Offers",
      impact: "Compare & Save",
      isPremium: true,
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: "Full CARFAX® Report",
      impact: "Valued at $44",
      isPremium: true,
    },
    {
      icon: <FileBarChart className="h-5 w-5 text-purple-600" />,
      title: "Feature-Based Adjustments",
      impact: "+20% Granularity",
      isPremium: true,
    },
    {
      icon: <FileClock className="h-5 w-5 text-indigo-600" />,
      title: "12-Month Value Forecast",
      impact: "Trends & Stats",
      isPremium: true,
    },
    {
      icon: <Search className="h-5 w-5 text-cyan-600" />,
      title: "Open Marketplace Analysis",
      impact: "Facebook, Craigslist, etc.",
      isPremium: true,
    },
    {
      icon: <FileText className="h-5 w-5 text-amber-600" />,
      title: "Professional PDF Report",
      impact: "Shareable Summary",
      isPremium: true,
    },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Premium Valuation Services"
          description="Comprehensive tools and data to get the most accurate and complete picture of your vehicle's value"
          className="text-center mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`p-0 hover:shadow-md transition-shadow ${
                service.isPremium
                  ? "border-primary/20 bg-primary/5"
                  : "border-border bg-background"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      service.isPremium ? "bg-white/80" : "bg-primary/10"
                    }`}
                  >
                    {service.icon}
                  </div>
                  <div className="flex-grow">
                    <span className="font-medium text-sm">{service.title}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-text-secondary">
                        {service.impact}
                      </span>
                      {service.isPremium && (
                        <span className="text-[10px] font-medium bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
                </div>
                <CardTitle className="mt-4">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link to={service.link}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link to="/premium">
              <Car className="mr-2 h-5 w-5" />
              Explore Premium Features
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PremiumServicesGrid;
