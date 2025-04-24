
import { SectionHeader, DesignCard, FeatureItem } from '@/components/ui/design-system';
import { 
  Award, TrendingUp, BarChart4, ShieldCheck, 
  Database, ClipboardCheck 
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Award className="h-5 w-5" />,
      title: "CARFAX® Integration",
      description: "Complete vehicle history analysis for superior accuracy in valuations"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Market Trend Analysis",
      description: "Future value projections based on historical market data"
    },
    {
      icon: <BarChart4 className="h-5 w-5" />,
      title: "Dealer Price Comparison",
      description: "See how your vehicle compares to current dealer listings"
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Confidence Scoring",
      description: "Know exactly how accurate your valuation is with confidence metrics"
    },
    {
      icon: <Database className="h-5 w-5" />,
      title: "Comprehensive Data",
      description: "Leveraging millions of data points for precise valuations"
    },
    {
      icon: <ClipboardCheck className="h-5 w-5" />,
      title: "Detailed Reports",
      description: "Professional PDF reports with complete valuation breakdown"
    }
  ];

  return (
    <section ref={featuresRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Why Choose Premium Valuation"
          description="Get the most accurate and comprehensive vehicle valuation with our premium service"
          align="center"
          className="mb-16"
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <DesignCard 
              key={i} 
              variant="outline"
              className="card-3d hover:border-primary/30 hover:bg-primary-light/20 transition-all"
            >
              <FeatureItem
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </DesignCard>
          ))}
        </div>
      </div>
    </section>
  );
}
