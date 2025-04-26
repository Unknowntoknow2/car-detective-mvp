
import { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PremiumFeaturesTabs } from './PremiumFeaturesTabs';
import { PremiumFeaturesGrid } from './PremiumFeaturesGrid';
import { getCategoryFeatures } from './data/premium-features';

export function EnhancedPremiumFeaturesTabs() {
  const [selectedFeature, setSelectedFeature] = useState<string>("carfax");
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <section className="py-24 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Premium Features
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Discover how our premium features provide the most comprehensive vehicle valuation available
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <PremiumFeaturesTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <TabsContent value={activeCategory} className="mt-4">
            <PremiumFeaturesGrid
              features={getCategoryFeatures(activeCategory)}
              selectedFeature={selectedFeature}
              onSelectFeature={setSelectedFeature}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
