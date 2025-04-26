
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface UnauthorizedRedirectTabProps {
  setActiveTab: (tab: string) => void;
}

export function UnauthorizedRedirectTab({ setActiveTab }: UnauthorizedRedirectTabProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetPremium = () => {
    // If user is logged in, navigate to premium purchase page
    if (user) {
      navigate("/premium-valuation");
    } else {
      // If not logged in, navigate to auth page
      navigate("/auth");
    }
  };
  
  const handleGoBack = () => {
    setActiveTab("vin");
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Lock className="h-5 w-5" />
          Premium Feature
        </CardTitle>
        <CardDescription className="text-amber-700">
          This feature requires premium access
        </CardDescription>
      </CardHeader>
      <CardContent className="text-amber-700">
        <p>
          Upgrade to our premium valuation package to unlock this feature along with comprehensive vehicle
          valuation reports, CARFAX history, dealer offers, and more.
        </p>
      </CardContent>
      <CardFooter className="flex gap-3 pt-0">
        <Button 
          variant="outline" 
          onClick={handleGoBack}
          className="border-amber-300 text-amber-800 hover:bg-amber-100"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button 
          onClick={handleGetPremium}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Get Premium Access
        </Button>
      </CardFooter>
    </Card>
  );
}
