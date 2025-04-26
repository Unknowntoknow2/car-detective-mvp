
import { Shield, AlertTriangle, Clock, FileText, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCarfaxReport } from '@/utils/carfax/mockCarfaxService';
import { useState, useEffect } from 'react';

interface VehicleHistoryProps {
  vin: string;
  valuationId: string;
}

export function VehicleHistory({ vin, valuationId }: VehicleHistoryProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchHistory = async () => {
      if (!vin) return;
      
      setIsLoading(true);
      try {
        const carfaxData = await getCarfaxReport(vin);
        setHistoryData(carfaxData);
      } catch (err) {
        setError('Could not retrieve vehicle history');
        console.error('Error fetching vehicle history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [vin]);
  
  if (!user) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Vehicle History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <Shield className="h-10 w-10 text-primary/60 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Premium Feature</h3>
            <p className="text-sm text-gray-600 mb-4">
              View full vehicle history with CARFAX integration
            </p>
            <Button asChild>
              <a href="/premium">Get Premium</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Vehicle History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !historyData) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Vehicle History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Could Not Load Vehicle History</h3>
            <p className="text-sm text-gray-600 mb-4">
              {error || "Unable to retrieve history data for this vehicle"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { accidentsReported, owners, serviceRecords, salvageTitle, titleEvents } = historyData;
  const hasIssues = accidentsReported > 0 || salvageTitle;
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vehicle History</CardTitle>
        {hasIssues ? (
          <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">History Issues</span>
          </div>
        ) : (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">Clean History</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-start space-x-2">
            <User className="h-5 w-5 text-slate-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium">Ownership</h3>
              <p className="text-sm text-slate-600">{owners} previous {owners === 1 ? 'owner' : 'owners'}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-slate-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium">Accidents</h3>
              <p className="text-sm text-slate-600">
                {accidentsReported} {accidentsReported === 1 ? 'accident' : 'accidents'} reported
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Clock className="h-5 w-5 text-slate-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium">Service Records</h3>
              <p className="text-sm text-slate-600">{serviceRecords} records found</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 text-slate-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium">Title Information</h3>
              <p className="text-sm text-slate-600">{titleEvents.join(', ')}</p>
            </div>
          </div>
        </div>
        
        <Button className="w-full mt-2" asChild>
          <a href={historyData.reportUrl} target="_blank" rel="noopener noreferrer">
            View Full CARFAX Report
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
