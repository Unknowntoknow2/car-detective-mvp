
import { SectionHeader } from '@/components/ui/design-system';
import { CheckCircleIcon, XCircleIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ComparisonSectionProps {
  scrollToForm: () => void;
}

export function ComparisonSection({ scrollToForm }: ComparisonSectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-surface to-surface-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="How Premium Compares"
          description="See the difference between our free and premium valuation services"
          align="center"
          className="mb-16"
        />
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="rounded-xl overflow-hidden border border-border bg-white">
            <div className="bg-surface-dark p-6">
              <h3 className="text-xl font-semibold">Free Valuation</h3>
              <p className="text-text-secondary mt-1">Basic vehicle valuation</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold">$0</p>
              <ul className="mt-6 space-y-3">
                {[
                  { feature: "Basic market value estimate", included: true },
                  { feature: "VIN and license plate lookup", included: true },
                  { feature: "Manual entry option", included: true },
                  { feature: "Simple condition assessment", included: true },
                  { feature: "CARFAX® history report", included: false },
                  { feature: "Accident history analysis", included: false },
                  { feature: "Market trend forecast", included: false },
                  { feature: "Dealer network comparison", included: false },
                  { feature: "Professional PDF report", included: false }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {item.included ? (
                      <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-text-tertiary flex-shrink-0" />
                    )}
                    <span className={item.included ? "text-text-primary" : "text-text-tertiary"}>
                      {item.feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-8">
                Start Free Valuation
              </Button>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden border-2 border-primary bg-white relative">
            <div className="absolute top-6 right-6">
              <Badge className="bg-primary text-white">Recommended</Badge>
            </div>
            <div className="bg-primary/10 p-6">
              <h3 className="text-xl font-semibold text-primary">Premium Valuation</h3>
              <p className="text-text-secondary mt-1">Complete vehicle history and premium insights</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold">$29.99</p>
              <ul className="mt-6 space-y-3">
                {[
                  { feature: "Basic market value estimate", included: true },
                  { feature: "VIN and license plate lookup", included: true },
                  { feature: "Manual entry option", included: true },
                  { feature: "Advanced condition assessment", included: true },
                  { feature: "CARFAX® history report", included: true, highlight: true },
                  { feature: "Accident history analysis", included: true, highlight: true },
                  { feature: "Market trend forecast", included: true, highlight: true },
                  { feature: "Dealer network comparison", included: true, highlight: true },
                  { feature: "Professional PDF report", included: true, highlight: true }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 ${item.highlight ? 'text-primary' : 'text-success'}`} />
                    <span className={item.highlight ? "text-text-primary font-medium" : "text-text-primary"}>
                      {item.feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-8" onClick={scrollToForm}>
                Get Premium Valuation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
