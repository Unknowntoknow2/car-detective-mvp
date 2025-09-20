
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VinDecoderResultsProps {
  stage: "initial" | "followup" | "complete";
  result: any;
  pipelineVehicle: any;
  requiredInputs: any;
  valuationResult: any;
  valuationError: string | null;
  pipelineLoading: boolean;
  submitValuation: () => Promise<void>;
  vin: string;
  carfaxData: any;
  onDownloadPdf: () => void;
}

const VinDecoderResults: React.FC<VinDecoderResultsProps> = ({
  stage,
  result,
  pipelineVehicle,
  requiredInputs,
  valuationResult,
  valuationError,
  pipelineLoading,
  submitValuation,
  vin,
  carfaxData,
  onDownloadPdf,
}) => {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            No Vehicle Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to decode vehicle information from the provided VIN.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.year && result.make && result.model && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Vehicle:</span>
              <Badge variant="secondary">
                {result.year} {result.make} {result.model}
              </Badge>
            </div>
          )}
          
          {result.engine && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Engine:</span>
              <span className="text-sm text-muted-foreground">{result.engine}</span>
            </div>
          )}
          
          {result.transmission && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Transmission:</span>
              <span className="text-sm text-muted-foreground">{result.transmission}</span>
            </div>
          )}
          
          {result.bodyClass && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Body Style:</span>
              <span className="text-sm text-muted-foreground">{result.bodyClass}</span>
            </div>
          )}
          
          {result.fuelType && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Fuel Type:</span>
              <span className="text-sm text-muted-foreground">{result.fuelType}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {stage === "complete" && valuationResult && (
        <Card>
          <CardHeader>
            <CardTitle>Valuation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ${valuationResult.estimatedValue?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confidence Score</p>
                <p className="text-2xl font-bold">
                  {valuationResult.confidenceScore || "N/A"}%
                </p>
              </div>
            </div>
            
            <Button onClick={onDownloadPdf} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
          </CardContent>
        </Card>
      )}

      {valuationError && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Valuation Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{valuationError}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VinDecoderResults;
