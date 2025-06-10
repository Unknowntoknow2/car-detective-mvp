
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { Crown, Star, Zap } from "lucide-react";

interface PremiumUpgradeCTAProps {
  onUpgrade: () => void;
}

export const PremiumUpgradeCTA = ({ onUpgrade }: PremiumUpgradeCTAProps) => {
  const { hasPremiumAccess, isLoading, error } = usePremiumAccess();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Error loading premium status</p>
        </CardContent>
      </Card>
    );
  }

  if (hasPremiumAccess) {
    return (
      <Card className="border-primary">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Premium Active
          </CardTitle>
          <CardDescription>
            You have access to all premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Badge variant="default" className="bg-primary">
            <Star className="w-3 h-3 mr-1" />
            Premium Member
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5" />
          Upgrade to Premium
        </CardTitle>
        <CardDescription>
          Unlock advanced vehicle valuations and detailed reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Detailed market analysis
          </li>
          <li className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Vehicle history reports
          </li>
          <li className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Premium support
          </li>
        </ul>
        
        <Button onClick={onUpgrade} className="w-full">
          <Crown className="mr-2 h-4 w-4" />
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default PremiumUpgradeCTA;
