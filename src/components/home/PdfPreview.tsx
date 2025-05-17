
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, FileText, ChevronRight, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function PdfPreview() {
  const [isHovering, setIsHovering] = useState(false);

  const handlePreviewClick = () => {
    toast('Demo Sample Report', {
      description: 'In a real implementation, this would open a sample PDF report',
      action: {
        label: 'Close',
        onClick: () => console.log('Closed'),
      },
    });
  };

  return (
    <Card className="w-full shadow-md border-muted-foreground/20">
      <CardHeader className="bg-surface-light pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          <span>PDF Report Preview</span>
          <Badge variant="outline" className="ml-2 bg-primary-light/20">Premium</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Comprehensive valuation report with CARFAX® data
        </p>
      </CardHeader>
      
      <CardContent className="p-4">
        <div 
          className="relative overflow-hidden rounded-md border border-muted mb-4 cursor-pointer group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handlePreviewClick}
        >
          {/* PDF preview image with blur */}
          <div className="relative">
            <img 
              src="https://img.freepik.com/free-vector/business-report-concept-illustration_114360-1509.jpg?w=740&t=st=1715606000~exp=1715606600~hmac=5d1bb07e718c2413ac3d25eb71ab16cc4be5cd48d0cd9f0d48889ac4e9d16bed" 
              alt="Sample PDF Report" 
              className="w-full filter blur-sm group-hover:blur-none transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white group-hover:bg-black/30 transition-all">
              <Lock className="h-8 w-8 mb-2" />
              <p className="text-lg font-bold">Premium Report</p>
              <p className="text-sm mb-3">Unlock with Premium Valuation</p>
              <Button 
                size="sm" 
                className="flex items-center mt-2 gap-1 group-hover:bg-primary group-hover:text-white transition-all"
                variant="outline"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Sample</span>
              </Button>
            </div>
            
            {/* Watermark diagonally across */}
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 -rotate-12">
              <div className="bg-primary/80 text-white text-center py-1 font-bold text-lg">
                SAMPLE REPORT
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Full Vehicle History</p>
              <p className="text-xs text-muted-foreground">CARFAX® report included ($44 value)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Detailed Value Breakdown</p>
              <p className="text-xs text-muted-foreground">See every factor that affects your car's value</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">AI-Verified Condition</p>
              <p className="text-xs text-muted-foreground">Photo analysis with condition verification</p>
            </div>
          </div>
          
          <Button
            className="w-full mt-2"
            onClick={handlePreviewClick}
          >
            View Sample Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
