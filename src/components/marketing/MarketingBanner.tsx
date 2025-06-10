
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MarketingBannerProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export const MarketingBanner = ({
  title,
  description,
  ctaText,
  ctaLink,
}: MarketingBannerProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-blue-100 mb-4">{description}</p>
        <Link href={ctaLink}>
          <Button variant="outline" className="text-blue-600 bg-white hover:bg-blue-50">
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MarketingBanner;
