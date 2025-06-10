
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

interface NextStepsCardProps {
  onDownloadPdf?: () => void;
  onEmailReport?: () => void;
  onGetOffers?: () => void;
}

export function NextStepsCard({
  onDownloadPdf,
  onEmailReport,
  onGetOffers,
}: NextStepsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <Button
            onClick={onDownloadPdf}
            variant="default"
            className="w-full justify-between"
          >
            <span>Download PDF Report</span>
            <Download className="h-4 w-4" />
          </Button>

          <Button
            onClick={onEmailReport}
            variant="outline"
            className="w-full justify-between"
          >
            <span>Email Report</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            onClick={onGetOffers}
            variant="outline"
            className="w-full justify-between"
          >
            <span>Get Dealer Offers</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
