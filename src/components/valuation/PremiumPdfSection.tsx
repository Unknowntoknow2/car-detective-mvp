
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Mail, Users, FileText } from 'lucide-react';
import { useDealerNotifications } from '@/hooks/useDealerNotifications';
import { ReportData, downloadValuationPdf } from '@/utils/pdfService';
import { toast } from 'sonner';

interface PremiumPdfSectionProps {
  valuationResult: any;
  isPremium: boolean;
}

export function PremiumPdfSection({ valuationResult, isPremium }: PremiumPdfSectionProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { isNotifying, notificationStatus, triggerDealerNotifications } = useDealerNotifications();

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const reportData: ReportData = {
        id: valuationResult.id || Date.now().toString(),
        make: valuationResult.make || 'Unknown',
        model: valuationResult.model || 'Unknown',
        year: valuationResult.year || 2020,
        mileage: valuationResult.mileage || 0,
        condition: valuationResult.condition || 'Good',
        estimatedValue: valuationResult.estimatedValue || 0,
        price: valuationResult.estimatedValue || 0,
        priceRange: valuationResult.priceRange || [0, 0],
        confidenceScore: valuationResult.confidenceScore || 75,
        zipCode: valuationResult.zipCode || '90210',
        adjustments: valuationResult.adjustments || [],
        generatedAt: new Date().toISOString(),
        vin: valuationResult.vin,
        isPremium: isPremium,
        aiCondition: {
          condition: valuationResult.condition || 'Good',
          confidenceScore: valuationResult.confidenceScore || 75,
          issuesDetected: [],
          aiSummary: `AI assessment of ${valuationResult.condition || 'Good'} condition`
        }
      };

      await downloadValuationPdf(reportData);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNotifyDealers = async () => {
    if (!valuationResult.zipCode) {
      toast.error('ZIP code is required to notify dealers');
      return;
    }

    const reportData: ReportData = {
      id: valuationResult.id || Date.now().toString(),
      make: valuationResult.make || 'Unknown',
      model: valuationResult.model || 'Unknown',
      year: valuationResult.year || 2020,
      mileage: valuationResult.mileage || 0,
      condition: valuationResult.condition || 'Good',
      estimatedValue: valuationResult.estimatedValue || 0,
      price: valuationResult.estimatedValue || 0,
      priceRange: valuationResult.priceRange || [0, 0],
      confidenceScore: valuationResult.confidenceScore || 75,
      zipCode: valuationResult.zipCode,
      adjustments: valuationResult.adjustments || [],
      generatedAt: new Date().toISOString(),
      vin: valuationResult.vin,
      isPremium: isPremium,
      aiCondition: {
        condition: valuationResult.condition || 'Good',
        confidenceScore: valuationResult.confidenceScore || 75,
        issuesDetected: [],
        aiSummary: `AI assessment of ${valuationResult.condition || 'Good'} condition`
      }
    };

    await triggerDealerNotifications(reportData, valuationResult.zipCode);
  };

  if (!isPremium) {
    return (
      <Card className="p-6 border border-orange-200 bg-orange-50">
        <div className="text-center space-y-4">
          <FileText className="w-12 h-12 text-orange-500 mx-auto" />
          <h3 className="text-lg font-semibold text-orange-900">Premium PDF Report</h3>
          <p className="text-orange-700">
            Upgrade to access detailed PDF reports with market analysis and dealer notifications.
          </p>
          <Button variant="outline" className="border-orange-300 text-orange-700">
            Upgrade to Premium
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Premium Actions</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Premium
          </Badge>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Generating PDF...' : 'Download Detailed Report'}
          </Button>

          <Button
            onClick={handleNotifyDealers}
            disabled={isNotifying || valuationResult.estimatedValue < 8000}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            {isNotifying ? 'Notifying Dealers...' : 'Notify Local Dealers'}
          </Button>

          {valuationResult.estimatedValue < 8000 && (
            <p className="text-sm text-gray-500 text-center">
              Dealer notifications are available for vehicles valued at $8,000+
            </p>
          )}

          {notificationStatus && (
            <div className={`p-3 rounded-md text-sm ${
              notificationStatus.success 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {notificationStatus.message}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t text-xs text-gray-500">
          <p>• Comprehensive market analysis</p>
          <p>• Auction intelligence data</p>
          <p>• Local dealer network alerts</p>
          <p>• Professional PDF formatting</p>
        </div>
      </div>
    </Card>
  );
}
