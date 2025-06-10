import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface VehicleHistoryTabProps {
  ctaText?: string;
  title?: string;
  description?: string;
}

export const VehicleHistoryTab = ({
  ctaText = "View Premium Report",
  title = "Unlock Full Vehicle History",
  description = "Get detailed insights into the vehicle's past.",
}: VehicleHistoryTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{description}</p>

        <a href="/premium">
          <Button variant="outline">
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};

export default VehicleHistoryTab;
