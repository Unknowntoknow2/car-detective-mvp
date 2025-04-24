
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onFreeValuationClick: () => void;
}

export function HeroSection({ onFreeValuationClick }: HeroSectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto max-w-5xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Know Your Car's True Value — Instantly
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Get precision car valuations powered by AI, real-time market data, and optional CARFAX-backed insights.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button asChild size="lg" onClick={onFreeValuationClick}>
            <Link to="#">Start Free Valuation</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/premium">Premium Valuation: Including CARFAX ($29.99)</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
