
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MarketingBannerProps {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
}

export function MarketingBanner({ 
  headline, 
  subtext, 
  ctaText, 
  ctaHref 
}: MarketingBannerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:translate-y-[-2px] hover:shadow-xl">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">{headline}</h3>
        <p className="text-slate-600">{subtext}</p>
        <Button asChild className="w-full sm:w-auto">
          <Link to={ctaHref}>{ctaText}</Link>
        </Button>
      </div>
    </div>
  );
}
