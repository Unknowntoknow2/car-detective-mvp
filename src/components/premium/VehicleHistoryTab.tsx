
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink } from "lucide-react";

interface VehicleHistoryTabProps {
  vehicleData: {
    vin?: string;
    make: string;
    model: string;
    year: number;
  };
  carfaxData?: any;
  isLoading?: boolean;
}

export const VehicleHistoryTab = ({
  vehicleData,
  carfaxData,
  isLoading = false,
}: VehicleHistoryTabProps) => {
  const handleDownloadReport = () => {
    console.log("Downloading vehicle history report");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading vehicle history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!carfaxData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vehicle History Report
          </CardTitle>
          <CardDescription>
            Get detailed history information for {vehicleData.year} {vehicleData.make} {vehicleData.model}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No vehicle history report available for this vehicle.
            </p>
            <Link href="/premium">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Get Premium Report
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Vehicle History Report
        </CardTitle>
        <CardDescription>
          Comprehensive history for {vehicleData.year} {vehicleData.make} {vehicleData.model}
          {vehicleData.vin && ` (VIN: ${vehicleData.vin})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Report Status</h3>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <Badge variant="outline">
            Available
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium">Accident History</h4>
            <p className="text-sm text-muted-foreground">
              {carfaxData.accidents ? `${carfaxData.accidents} reported` : "No accidents reported"}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Service Records</h4>
            <p className="text-sm text-muted-foreground">
              {carfaxData.serviceRecords ? `${carfaxData.serviceRecords} records` : "No service records"}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Previous Owners</h4>
            <p className="text-sm text-muted-foreground">
              {carfaxData.owners || "1"} owner(s)
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Title Issues</h4>
            <p className="text-sm text-muted-foreground">
              {carfaxData.titleIssues ? "Issues found" : "Clean title"}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleDownloadReport} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleHistoryTab;
