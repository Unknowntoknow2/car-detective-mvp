
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Printer, Share2, History } from 'lucide-react';

export interface NextStepsCardProps {
  valuationId: string;
}

export function NextStepsCard({ valuationId }: NextStepsCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Save Report
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Report
          </Button>
          
          <Button variant="outline" className="flex items-center justify-center gap-2" asChild>
            <Link to="/valuations">
              <History className="h-4 w-4" />
              View History
            </Link>
          </Button>
        </div>
        
        <div className="pt-4">
          <Button className="w-full" asChild>
            <Link to={`/premium?valuationId=${valuationId}`}>
              Upgrade to Premium
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground text-center mt-2">
          Get detailed insights and dealer offers with our Premium Valuation
        </p>
      </CardContent>
    </Card>
  );
}
