
<<<<<<< HEAD
import React from 'react';
import { ValuationResult } from '@/types/valuation';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadPDFButton } from '@/components/ui/DownloadPDFButton';
import { ExternalLink } from 'lucide-react';

interface ResultsDisplayProps {
  valuation: ValuationResult;
  isPremium?: boolean;
}
=======
// Categorized icons for feature types
const categoryIcons = {
  "Safety": <Shield className="h-4 w-4 text-blue-500" />,
  "Entertainment": <Zap className="h-4 w-4 text-purple-500" />,
  "Comfort": <Star className="h-4 w-4 text-green-500" />,
  "Performance": <Flame className="h-4 w-4 text-red-500" />,
  "Other": null,
};

// Updated condition tips with more detailed guidance
const conditionTips = {
  "Poor": {
    description: "Major mechanical or cosmetic issues that need attention",
    tip:
      "Major repairs needed: address significant mechanical or body damage, prioritize essential fixes",
  },
  "Fair": {
    description: "Some wear and tear, minor repairs needed",
    tip:
      "Minor repairs and maintenance can significantly improve vehicle value",
  },
  "Good": {
    description: "Well maintained with minimal wear",
    tip:
      "Regular maintenance and minor detailing can maintain current condition",
  },
  "Excellent": {
    description: "Exceptional condition with full service history",
    tip: "Continue meticulous maintenance to preserve top-tier condition",
  },
};

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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

// Add explicit typing for the feature and index parameters
const FeaturesList = ({ features }: { features: string[] }) => {
  return (
<<<<<<< HEAD
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Features</h3>
      <div className="grid grid-cols-2 gap-2">
        {features.map((feature: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>{feature}</span>
          </div>
        ))}
      </div>
=======
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-xl font-bold mb-4">Your Vehicle Valuation</h3>
      <p className="text-lg">
        Estimated Value: <strong>${valuation.estimatedValue}</strong>
      </p>
      <p className="text-sm text-gray-500">
        Confidence: {valuation.confidence}%
      </p>

      {valuation.condition && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <h4 className="font-semibold text-lg mb-2">
            Vehicle Condition: {valuation.condition}
          </h4>
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
                    {categoryIcons[f.category] || null}
                    <span className="text-sm">{f.name}</span>
                  </div>
                  <span className="text-green-600 font-medium text-sm">
                    +${f.value_impact}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {offerComparisons.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-lg mb-3">
            Dealer Offer Comparisons
          </h4>
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ valuation, isPremium }) => {
  const {
    make,
    model,
    year,
    mileage,
    id: valuationId,
  } = valuation || {};

  // Handle both naming conventions
  const condition = valuation.condition || 'Unknown';
  const estimatedValue = valuation.estimatedValue || valuation.estimated_value || 0;
  const confidenceScore = valuation.confidenceScore || valuation.confidence_score || 75;
  const features = valuation.features || [];
  const pdfUrl = valuation.pdfUrl || '';
  const gptExplanation = valuation.gptExplanation || valuation.explanation || '';

  const vehicleName = make && model ? `${year} ${make} ${model}` : 'Vehicle Details Not Available';
  const formattedValue = estimatedValue ? formatCurrency(estimatedValue) : 'Value Not Available';
  const formattedConfidence = confidenceScore ? `${confidenceScore}%` : 'N/A';

  // Fix the type issue with ValuationResult vs Valuation
  // For example, use optional chaining or nullish coalescing:
  const id = valuation?.id || '';

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-xl rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{vehicleName}</CardTitle>
          {isPremium && (
            <Badge variant="secondary">Premium Valuation</Badge>
          )}
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Valuation Details</h3>
              <p><strong>Estimated Value:</strong> {formattedValue}</p>
              <p><strong>Confidence Score:</strong> {formattedConfidence}</p>
              <p><strong>Condition:</strong> {condition}</p>
              <p><strong>Mileage:</strong> {mileage ? mileage.toLocaleString() : 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <p><strong>Make:</strong> {make || 'Not specified'}</p>
              <p><strong>Model:</strong> {model || 'Not specified'}</p>
              <p><strong>Year:</strong> {year || 'Not specified'}</p>
            </div>
          </div>

          {features && features.length > 0 && (
            <FeaturesList features={features} />
          )}

          {gptExplanation && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">AI Explanation</h3>
              <p className="text-justify">{gptExplanation}</p>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            {valuationId && (
              <DownloadPDFButton valuationId={valuationId}>
                Download Report
              </DownloadPDFButton>
            )}
            {pdfUrl && (
              <Button asChild variant="link">
                <Link to={pdfUrl} target="_blank" rel="noopener noreferrer">
                  View Full Report <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
