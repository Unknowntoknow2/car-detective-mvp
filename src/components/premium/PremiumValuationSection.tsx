
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/design-system';
import { PremiumInfoCards } from './features/PremiumInfoCards';
import { PremiumValuationForm } from './form/PremiumValuationForm';

// Change from named export to default export
export default function PremiumValuationSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="bg-primary/5 text-primary mb-4">
              CARFAX® Report Included ($44 value)
            </Badge>
            <SectionHeader
              title="Premium Vehicle Valuation"
              description="Get the most accurate valuation with our professional-grade service, including CARFAX® report, dealer offers, and market analysis"
              size="lg"
              className="max-w-3xl mx-auto"
            />
          </div>

          <PremiumInfoCards />
          <PremiumValuationForm />
        </div>
      </div>
    </div>
  );
}
