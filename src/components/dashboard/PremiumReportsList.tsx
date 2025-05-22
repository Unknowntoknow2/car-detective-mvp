
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Download, FileBarChart, Clock } from 'lucide-react';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';

interface PremiumReport {
  id: string;
  created_at: string;
  status: string;
  vehicle_info?: {
    make?: string;
    model?: string;
    year?: number;
    vin?: string;
    estimatedValue?: number;
  };
}

export default function PremiumReportsList() {
  const [reports, setReports] = useState<PremiumReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchPremiumReports = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, valuations(*)')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formattedReports = data?.map(order => ({
          id: order.id,
          created_at: order.created_at,
          status: order.status,
          vehicle_info: order.valuations ? {
            make: order.valuations.make,
            model: order.valuations.model,
            year: order.valuations.year,
            vin: order.valuations.vin,
            estimatedValue: order.valuations.estimated_value || 0
          } : undefined
        })) || [];
        
        setReports(formattedReports);
      } catch (error: any) {
        console.error('Error fetching premium reports:', error.message);
        toast.error('Failed to load premium reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPremiumReports();
  }, [user]);

  const handleDownloadReport = (report: PremiumReport) => {
    if (!report.vehicle_info) {
      toast.error('Vehicle information not available');
      return;
    }
    
    const reportData = convertVehicleInfoToReportData({
      ...report.vehicle_info,
      mileage: 0, // Add default mileage value
      vin: report.vehicle_info.vin || 'Unknown',
      make: report.vehicle_info.make || 'Unknown',
      model: report.vehicle_info.model || 'Unknown',
      year: report.vehicle_info.year || 0,
      transmission: 'Unknown', // Add the required transmission field
    }, {
      estimatedValue: report.vehicle_info.estimatedValue || 0,
      mileage: 0,
      confidenceScore: 90,
      condition: "Excellent",
      zipCode: "10001",
      adjustments: [],
      isPremium: true
    });
    
    downloadPdf(reportData);
    toast.success('Downloading your premium report');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Premium Reports</CardTitle>
          <CardDescription>You haven't purchased any premium reports yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileBarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="mb-4">Get comprehensive vehicle valuations with CARFAX® reports</p>
          <Button onClick={() => navigate('/premium')}>
            Get Premium Valuation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Premium Reports</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {report.vehicle_info?.make} {report.vehicle_info?.model}
                </CardTitle>
                <div className="flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3 mr-1" />
                  Premium
                </div>
              </div>
              <CardDescription>
                {report.vehicle_info?.year || 'N/A'} 
                {report.vehicle_info?.vin ? ` • VIN: ${report.vehicle_info.vin.substring(0, 6)}...` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Created on {new Date(report.created_at).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleDownloadReport(report)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
