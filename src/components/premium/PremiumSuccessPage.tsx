
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const PremiumSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const valuationId = searchParams.get("valuation_id");

  useEffect(() => {
    // Store success state in localStorage
    localStorage.setItem("premium_payment_success", "true");
    if (valuationId) {
      localStorage.setItem("premium_valuation_id", valuationId);
    }
  }, [valuationId]);

  const handleDownloadReport = () => {
    if (valuationId) {
      navigate(`/valuation/${valuationId}/download`);
    }
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800">
            Payment Successful!
          </CardTitle>
          <p className="text-green-700 mt-2">
            Thank you for upgrading to premium. Your premium valuation report is now ready.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-2">What's included:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Comprehensive valuation report
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                CARFAX vehicle history report
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Market comparison analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Dealer offers and recommendations
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleDownloadReport}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!valuationId}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Premium Report
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleViewDashboard}
              className="w-full border-green-300 text-green-800 hover:bg-green-100"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Dashboard
            </Button>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            You can access your premium reports anytime from your dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
