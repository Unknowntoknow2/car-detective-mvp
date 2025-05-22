
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Car, FileCheck, Receipt, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PremiumServicesGrid() {
  const premiumServices = [
    {
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
