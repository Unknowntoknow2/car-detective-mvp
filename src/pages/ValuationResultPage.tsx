
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, TrendingUp, Download, Share, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export default function ValuationResultPage() {
  const navigate = useNavigate();
  const [valuationData, setValuationData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('latest_valuation');
    if (data) {
      try {
        setValuationData(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing valuation data:', error);
        navigate('/valuation');
      }
    } else {
      navigate('/valuation');
    }
  }, [navigate]);

  if (!valuationData) {
    return null;
  }

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/valuation')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Start New Valuation
          </Button>
          <div className="text-sm text-muted-foreground">
            Generated on {new Date(valuationData.timestamp).toLocaleDateString()}
          </div>
        </div>

        {/* Vehicle Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              {valuationData.year} {valuationData.make} {valuationData.model}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-semibold">{valuationData.mileage?.toLocaleString()} miles</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <Badge variant="outline" className="capitalize">{valuationData.condition}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">{valuationData.zipCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="font-semibold">{valuationData.confidenceScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valuation Result */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Estimated Market Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {formatCurrency(valuationData.estimatedValue)}
              </div>
              <p className="text-muted-foreground mb-4">
                Based on current market conditions and vehicle specifics
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Trade-in Value</p>
                  <p className="font-semibold">{formatCurrency(Math.round(valuationData.estimatedValue * 0.85))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Private Sale</p>
                  <p className="font-semibold">{formatCurrency(valuationData.estimatedValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Retail Value</p>
                  <p className="font-semibold">{formatCurrency(Math.round(valuationData.estimatedValue * 1.15))}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" className="flex-1">
            <Share className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Button variant="outline" onClick={() => navigate('/premium')}>
            Get Premium Report
          </Button>
        </div>

        {/* Market Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This {valuationData.year} {valuationData.make} {valuationData.model} shows strong market performance 
              in the {valuationData.zipCode} area. Current inventory levels suggest stable pricing with 
              moderate demand. The {valuationData.condition} condition rating aligns well with market expectations 
              for vehicles with {valuationData.mileage?.toLocaleString()} miles.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
