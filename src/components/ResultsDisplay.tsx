
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Shield, Star, Zap } from "lucide-react";

// Categorized icons for feature types
const categoryIcons = {
  "Safety": <Shield className="h-4 w-4 text-blue-500" />,
  "Entertainment": <Zap className="h-4 w-4 text-purple-500" />,
  "Comfort": <Star className="h-4 w-4 text-green-500" />,
  "Performance": <Flame className="h-4 w-4 text-red-500" />,
  "Other": null
};

// Updated condition tips with more detailed guidance
const conditionTips = {
  "Poor": {
    description: "Major mechanical or cosmetic issues that need attention",
    tip: "Major repairs needed: address significant mechanical or body damage, prioritize essential fixes"
  },
  "Fair": {
    description: "Some wear and tear, minor repairs needed",
    tip: "Minor repairs and maintenance can significantly improve vehicle value"
  },
  "Good": {
    description: "Well maintained with minimal wear",
    tip: "Regular maintenance and minor detailing can maintain current condition"
  },
  "Excellent": {
    description: "Exceptional condition with full service history",
    tip: "Continue meticulous maintenance to preserve top-tier condition"
  }
};

// Valid condition types
type ValidCondition = keyof typeof conditionTips;
type ValidCategory = keyof typeof categoryIcons;

export default function ResultsDisplay({ valuation }: { valuation: any }) {
  const [features, setFeatures] = useState<any[]>([]);
  const [dealerOffers, setDealerOffers] = useState<any[]>([]);
  const [offerComparisons, setOfferComparisons] = useState<any[]>([]);

  useEffect(() => {
    if (valuation?.feature_ids?.length) {
      supabase.from("features")
        .select("id, name, value_impact, category")
        .in("id", valuation.feature_ids)
        .then(({ data }) => {
          if (data) setFeatures(data);
        });
    }

    supabase
      .from("dealer_offers")
      .select("*")
      .eq("report_id", valuation.id)
      .then(({ data }) => {
        if (data) setDealerOffers(data);
      });

    // Mock offer comparisons
    setOfferComparisons([
      { id: 1, dealer: "Dealer A", offer: valuation.estimatedValue - 500 },
      { id: 2, dealer: "Dealer B", offer: valuation.estimatedValue + 250 },
      { id: 3, dealer: "Dealer C", offer: valuation.estimatedValue - 1000 },
    ]);
  }, [valuation]);

  // Type guard to check if the condition is valid
  const isValidCondition = (condition: string): condition is ValidCondition => 
    Object.keys(conditionTips).includes(condition);
  
  // Type guard for category
  const isValidCategory = (category: string): category is ValidCategory =>
    Object.keys(categoryIcons).includes(category);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-xl font-bold mb-4">Your Vehicle Valuation</h3>
      <p className="text-lg">Estimated Value: <strong>${valuation.estimatedValue}</strong></p>
      <p className="text-sm text-gray-500">Confidence: {valuation.confidence}%</p>

      {valuation.condition && isValidCondition(valuation.condition) && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <h4 className="font-semibold text-lg mb-2">Vehicle Condition: {valuation.condition}</h4>
          <div className="flex items-start space-x-3">
            <div className="flex-grow">
              <p className="text-sm text-gray-700">
                {conditionTips[valuation.condition].description}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Tip:</strong> {conditionTips[valuation.condition].tip}
              </p>
            </div>
          </div>
        </div>
      )}

      {features.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-3">Value-Adding Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((f) => (
                <div 
                  key={f.id} 
                  className="bg-gray-50 p-3 rounded-md shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    {isValidCategory(f.category) ? categoryIcons[f.category] : null}
                    <span className="text-sm">{f.name}</span>
                  </div>
                  <span className="text-green-600 font-medium text-sm">+${f.value_impact}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {offerComparisons.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-3">Dealer Offer Comparisons</h4>
          <ul>
            {offerComparisons.map((offer) => (
              <li key={offer.id} className="py-2 border-b">
                {offer.dealer}: ${offer.offer}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dealerOffers.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-3">Dealer Offers</h4>
          <ul>
            {dealerOffers.map((offer) => (
              <li key={offer.id} className="py-2 border-b">
                {offer.message} - Offer: ${offer.offer_amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
