
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export interface MarketingBannerProps {
  title?: string;
  headline?: string;
  description?: string;
  subtext?: string;
  ctaText: string;
  ctaLink?: string;
  ctaHref?: string;
  variant?: 'default' | 'premium';
  className?: string;
}

export const MarketingBanner: React.FC<MarketingBannerProps> = ({
  title,
  headline,
  description,
  subtext,
  ctaText,
  ctaLink,
  ctaHref,
  variant = 'default',
  className = ''
}) => {
  const displayTitle = title || headline;
  const displayDescription = description || subtext;
  const displayLink = ctaLink || ctaHref;

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {displayTitle && (
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {displayTitle}
          </h2>
        )}
        
        {displayDescription && (
          <p className="text-lg mb-6 text-blue-100">
            {displayDescription}
          </p>
        )}
        
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-gray-100"
          onClick={() => window.location.href = displayLink || '#'}
        >
          {ctaText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MarketingBanner;
