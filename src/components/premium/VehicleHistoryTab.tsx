
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Users, Car, Check, X, History, Wrench, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface VehicleHistoryTabProps {
  vin: string;
  valuationId: string;
  historyData?: any;
}

export function VehicleHistoryTab({ vin, valuationId, historyData }: VehicleHistoryTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(historyData);
  
  const fetchHistoryData = async () => {
    setIsLoading(true);
    
    try {
      // Wait for 2 seconds for a more realistic loading experience
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we'll just use mock data
      const mockData = {
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
      
      setData(mockData);
      toast.success("Vehicle history report generated successfully!");
    } catch (error) {
      console.error("Error fetching vehicle history:", error);
      toast.error("Failed to generate vehicle history report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!data && !isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 text-center">
          <div className="max-w-md mx-auto">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">CARFAX Vehicle History Report</h3>
            <p className="text-slate-600 mb-6">
              Get detailed insights about this vehicle's past including accidents, service records, ownership history, and more.
            </p>
            <Button 
              onClick={fetchHistoryData} 
              className="bg-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Generating Report..." : "Generate CARFAX Report"}
            </Button>
            <p className="text-xs text-slate-500 mt-4">
              Included with your Premium Valuation ($44.99 value)
            </p>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Complete History</h4>
                <p className="text-sm text-slate-500 mt-1">Full ownership and registration history.</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium">Accident Records</h4>
                <p className="text-sm text-slate-500 mt-1">Detailed accident and damage reports.</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <Wrench className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Service Records</h4>
                <p className="text-sm text-slate-500 mt-1">Maintenance and service history details.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-semibold mb-3">Generating Your Report</h3>
        <p className="text-slate-600 mb-6">
          Please wait while we compile your comprehensive vehicle history report...
        </p>
        <div className="h-2 bg-slate-100 rounded-full max-w-md mx-auto overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-progress" style={{ width: "60%" }} />
        </div>
        <p className="text-sm text-slate-500 mt-4">
          This usually takes 15-30 seconds
        </p>
      </Card>
    );
  }
  
  // Display the report data
  const reportData = data.reportData;
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">CARFAX Vehicle History Report</h3>
              <p className="text-sm text-slate-500">VIN: {vin}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <a href={data.reportUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" />
              View Full Report
            </a>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center text-center">
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{reportData.owners}</p>
            <p className="text-sm text-slate-600">Previous Owners</p>
          </div>
          
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center text-center">
            <AlertTriangle className="h-6 w-6 text-amber-600 mb-2" />
            <p className="text-2xl font-bold">{reportData.accidentsReported}</p>
            <p className="text-sm text-slate-600">Accidents Reported</p>
          </div>
          
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center text-center">
            <Wrench className="h-6 w-6 text-green-600 mb-2" />
            <p className="text-2xl font-bold">{reportData.serviceRecords}</p>
            <p className="text-sm text-slate-600">Service Records</p>
          </div>
          
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center text-center">
            <Car className="h-6 w-6 text-purple-600 mb-2" />
            <p className="text-lg font-bold">{reportData.titleEvents[0]}</p>
            <p className="text-sm text-slate-600">Title Status</p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-lg font-semibold mb-4">Impact on Vehicle Value</h4>
          
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              reportData.estimatedValueImpact < 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}>
              {reportData.estimatedValueImpact < 0 ? (
                <X className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </div>
            <p className="font-medium">
              {reportData.accidentsReported > 0 
                ? `${reportData.accidentsReported} accident(s) reported` 
                : "No accidents reported"}
            </p>
            {reportData.estimatedValueImpact !== 0 && (
              <span className={reportData.estimatedValueImpact < 0 ? "text-red-600" : "text-green-600"}>
                {reportData.estimatedValueImpact > 0 ? "+" : ""}
                ${Math.abs(reportData.estimatedValueImpact).toLocaleString()}
              </span>
            )}
          </div>
          
          {reportData.damageTypes.map((damage: string, index: number) => (
            <div key={index} className="ml-8 text-sm text-slate-600 mb-1">
              • {damage}
            </div>
          ))}
          
          <div className="flex items-center gap-2 mt-4 mb-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Check className="h-4 w-4" />
            </div>
            <p className="font-medium">Clean title history</p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 mb-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <Check className="h-4 w-4" />
            </div>
            <p className="font-medium">Regular service history documented</p>
          </div>
        </div>
      </Card>
      
      <p className="text-sm text-slate-500 italic">
        CARFAX® Vehicle History Reports are based on information supplied to CARFAX. 
        CARFAX does not have the complete history of every vehicle.
      </p>
    </div>
  );
}
