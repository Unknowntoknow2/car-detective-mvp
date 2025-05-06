
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Download, PlusCircle, RefreshCw, Filter } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useValuationHistory } from "@/hooks/useValuationHistory";
import { toast } from "sonner";
import { PremiumBadge } from "@/components/ui/premium-badge";
import { downloadPdf } from '@/utils/pdf';
import { ReportData } from '@/utils/pdf/types';
import { Valuation } from '@/types/valuation-history';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function MyValuationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>("all");
  const { valuations, isLoading, error, isEmpty } = useValuationHistory();
  
  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user && !isLoading) {
      toast.error("Please sign in to view your valuations");
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const getIdentifier = (valuation: Valuation) => {
    if (valuation.vin) return `VIN: ${valuation.vin}`;
    if (valuation.plate) {
      return `Plate: ${valuation.plate}${valuation.state ? ` (${valuation.state})` : ''}`;
    }
    return 'No identifier';
  };
  
  const handleDownloadPdf = (valuation: Valuation) => {
    // Create a properly formatted ReportData object with all required fields
    const reportData: ReportData = {
      vin: valuation.vin || '',
      make: valuation.make || '',
      model: valuation.model || '',
      year: valuation.year || 0,
      plate: valuation.plate || '',
      state: valuation.state || '',
      mileage: valuation.mileage?.toString() || '0',
      condition: valuation.condition || 'Not Specified',
      zipCode: valuation.state || 'Not Available',
      estimatedValue: valuation.estimated_value || valuation.valuation || 0,
      confidenceScore: valuation.confidence_score || 0,
      color: valuation.color || 'Not Specified',
      bodyStyle: valuation.body_style || 'Not Specified',
      bodyType: valuation.body_type || 'Not Specified',
      fuelType: valuation.fuel_type || 'Not Specified',
      explanation: valuation.explanation || 'No additional information available for this vehicle.',
      isPremium: valuation.premium_unlocked || valuation.is_premium || false,
      transmission: valuation.transmission
    };
    
    downloadPdf(reportData);
  };

  const handleViewValuation = (valuation: Valuation) => {
    if (valuation.premium_unlocked) {
      navigate(`/valuation/${valuation.id}/premium`);
    } else {
      navigate(`/valuation/${valuation.id}`);
    }
  };

  const filteredValuations = valuations.filter(valuation => {
    if (filterType === "all") return true;
    if (filterType === "premium") return valuation.premium_unlocked || valuation.is_premium;
    if (filterType === "standard") return !valuation.premium_unlocked && !valuation.is_premium;
    return true;
  });
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Valuations</h1>
        <Button onClick={() => navigate('/lookup/vin')} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Valuation
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Valuation History</CardTitle>
            <CardDescription>
              View and manage your vehicle valuation reports
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="premium">Premium Only</SelectItem>
                <SelectItem value="standard">Standard Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">
              <p>Something went wrong while loading your valuations.</p>
              <p className="text-sm mt-2">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : isEmpty ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No valuations yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any vehicle valuations yet.
              </p>
              <Button onClick={() => navigate('/lookup/vin')}>
                Get Your First Valuation
              </Button>
            </div>
          ) : filteredValuations.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                No valuations match your current filter.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilterType("all")}
              >
                Clear Filter
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredValuations.map((valuation) => (
                  <TableRow key={valuation.id}>
                    <TableCell>{formatDate(valuation.created_at)}</TableCell>
                    <TableCell>
                      {valuation.year} {valuation.make} {valuation.model}
                    </TableCell>
                    <TableCell>{getIdentifier(valuation)}</TableCell>
                    <TableCell>
                      {formatCurrency(valuation.estimated_value || valuation.valuation)}
                    </TableCell>
                    <TableCell>
                      {valuation.premium_unlocked || valuation.is_premium ? (
                        <PremiumBadge size="sm" variant="default" />
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/premium?id=${valuation.id}`)}
                        >
                          Upgrade
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewValuation(valuation)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadPdf(valuation)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
