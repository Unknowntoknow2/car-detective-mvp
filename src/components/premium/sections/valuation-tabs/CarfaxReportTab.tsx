
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, AlertTriangle, FileText, Users, Car, Check, X } from "lucide-react";
import { TabContentWrapper } from "./TabContentWrapper";
import { VehicleHistoryTab } from "@/components/premium/VehicleHistoryTab";

interface CarfaxReportProps {
  vin?: string;
}

export function CarfaxReportTab({ vin }: CarfaxReportProps) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <TabContentWrapper
        title="CARFAX Vehicle History Report"
        description="Get a comprehensive vehicle history report with detailed accident data, service records, and title information"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
          <p className="text-amber-700 mb-4">
            You need to be logged in to view CARFAX reports.
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <a href="/auth">Sign In / Register</a>
          </Button>
        </div>
      </TabContentWrapper>
    );
  }
  
  if (!vin) {
    return (
      <TabContentWrapper
        title="CARFAX Vehicle History Report"
        description="Get a comprehensive vehicle history report with detailed accident data, service records, and title information"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Vehicle Information Required</h3>
          <p className="text-amber-700 mb-4">
            Please first look up a vehicle using VIN, license plate, or manual entry
            to generate a CARFAX report.
          </p>
        </div>
      </TabContentWrapper>
    );
  }
  
  // Mock data for CARFAX report
  const mockCarfaxData = {
    reportUrl: `https://mock-carfax.com/report/${vin}`,
    reportData: {
      owners: 2,
      accidentsReported: 1,
      damageTypes: ['Minor collision'],
      serviceRecords: 8,
      titleEvents: ['Clean title'],
      estimatedValueImpact: -500
    }
  };
  
  return (
    <TabContentWrapper
      title="CARFAX Vehicle History Report"
      description="Comprehensive vehicle history report with detailed accident data, service records, and title information"
    >
      <VehicleHistoryTab 
        vin={vin} 
        valuationId="mock-valuation-id"
        historyData={mockCarfaxData}
      />
    </TabContentWrapper>
  );
}
