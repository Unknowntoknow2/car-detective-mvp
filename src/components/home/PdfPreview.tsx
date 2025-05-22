
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';

export function PdfPreview() {
  return (
    <div className="relative">
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src="/images/pdf-preview.png" 
              alt="PDF Report Preview" 
              className="w-full h-auto rounded-t-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1599321969468-de7fe638f871?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Button variant="outline" className="bg-white text-primary">
                <Eye className="mr-2 h-4 w-4" />
                Preview Sample Report
              </Button>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-lg font-semibold mb-1">Premium PDF Report</h3>
            <p className="text-sm text-muted-foreground">
              Detailed valuation with market analysis, condition assessment, and future value prediction.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="absolute -right-4 -top-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-12">
        Premium
      </div>
    </div>
  );
}

export default PdfPreview;
