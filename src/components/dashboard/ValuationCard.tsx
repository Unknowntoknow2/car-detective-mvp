
import React from 'react';
import { motion } from 'framer-motion';
import { PremiumBadge } from './PremiumBadge';
import { BadgeCheck, Calendar, ChevronRight, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import { Link } from 'react-router-dom';
import { AnimatedCard } from '@/components/ui/animated-card';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ValuationCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  estimatedValue: number;
  confidenceScore?: number;
  condition?: string;
  isPremium?: boolean;
  created_at: string;
  index?: number;
}

export function ValuationCard({
  id,
  make,
  model,
  year,
  estimatedValue,
  confidenceScore,
  condition = 'Good',
  isPremium = false,
  created_at,
  index = 0,
}: ValuationCardProps) {
  // Format date nicely
  const date = new Date(created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <AnimatedCard
      animate={true}
      hoverEffect="lift"
      delay={index * 0.1}
      className={cn(
        "overflow-hidden border",
        isPremium ? "border-amber-200 bg-gradient-to-b from-amber-50 to-white" : "border-gray-200"
      )}
    >
      <CardHeader className="p-4 space-y-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </p>
            <CardTitle className="text-xl mt-1">
              {year} {make} {model}
            </CardTitle>
          </div>
          {isPremium && <PremiumBadge variant="gold" />}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-primary">{formatCurrency(estimatedValue)}</p>
            <p className="text-sm text-muted-foreground">Estimated Value</p>
          </div>
          <div className="flex gap-2 text-sm">
            {confidenceScore && (
              <div className="border rounded-md px-2 py-1 flex items-center">
                <Gauge className="h-3 w-3 mr-1" />
                <span>{confidenceScore}%</span>
              </div>
            )}
            <div className="border rounded-md px-2 py-1 flex items-center">
              <BadgeCheck className="h-3 w-3 mr-1" />
              <span>{condition}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link 
          to={`/valuation/${id}`} 
          className="w-full inline-flex justify-center items-center px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary text-sm font-medium"
        >
          View Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </CardFooter>
    </AnimatedCard>
  );
}
