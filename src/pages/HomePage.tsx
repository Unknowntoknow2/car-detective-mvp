
import React from 'react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { LookupTabs } from '@/components/home/LookupTabs';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, CircleDollarSign } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Find Your Car's Value in Minutes
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Get an accurate valuation of your vehicle with our advanced
                pricing algorithm. Free, fast, and reliable.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button onClick={() => navigate('/premium')} className="gap-1">
                <CircleDollarSign className="h-4 w-4" />
                Premium Valuation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">Real-time market data analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">Advanced condition assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">Detailed PDF reports available</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <LookupTabs />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
