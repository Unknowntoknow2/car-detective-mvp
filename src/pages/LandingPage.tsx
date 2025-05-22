
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Discover Your Vehicle's True Value
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Get accurate, data-driven valuations with advanced AI technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/valuation')}
            className="text-lg px-8"
          >
            Get Started
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-lg px-8"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
