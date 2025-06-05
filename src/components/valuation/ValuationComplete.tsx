
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Share2, Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface ValuationCompleteProps {
  valuationId: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    estimatedValue: number;
  };
  isPremium?: boolean;
  onShareClick?: () => void;
  onDownloadPdf?: () => void;
}

export function ValuationComplete({
  valuationId,
  vehicleInfo,
  isPremium = false,
  onShareClick,
  onDownloadPdf
}: ValuationCompleteProps) {
  const handleShare = () => {
    if (onShareClick) {
      onShareClick();
    } else {
      const shareUrl = `${window.location.origin}/valuation/${valuationId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      toast.info("PDF download feature coming soon");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-green-800">
            Valuation Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
          </h2>
          <div className="text-3xl font-bold text-green-600 mb-4">
            ${vehicleInfo.estimatedValue.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">
            Your vehicle valuation has been successfully generated
          </p>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={handleShare}
            >
              <div className="flex items-center">
                <Share2 className="h-4 w-4 mr-2 text-blue-600" />
                <span>Share this valuation</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={handleDownload}
            >
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-2 text-primary" />
                <span>Download PDF report</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
              asChild
            >
              <a href={`/valuation/${valuationId}`}>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-green-600" />
                  <span>View full valuation details</span>
                </div>
              </a>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
              asChild
            >
              <a href="/valuation">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Start a new valuation</span>
                </div>
              </a>
            </Button>
          </div>

          {!isPremium && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="font-medium text-yellow-800 mb-2">
                Unlock Premium Features
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                Get detailed market analysis, CARFAX reports, and enhanced valuation accuracy.
              </p>
              <Button 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                asChild
              >
                <a href={`/premium?valuationId=${valuationId}`}>
                  Upgrade to Premium
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ValuationComplete;
