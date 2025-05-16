
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="py-12">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to CarDetective</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your trusted source for car valuation and automotive insights
          </p>
          
          <HeroSection />
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button asChild size="lg">
              <Link to="/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
