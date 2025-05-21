
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

// Add explicit typing for the feature and index parameters
const FeaturesList = ({ features }: { features: string[] }) => {
  return (
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
