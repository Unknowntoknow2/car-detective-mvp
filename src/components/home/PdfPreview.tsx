
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, FileText, Download, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function PdfPreview() {
  return (
    <div className="relative">
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden border-primary/20 shadow-lg">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src="/images/pdf-preview.png" 
                alt="PDF Report Preview" 
                className="w-full h-auto rounded-t-lg object-cover"
                style={{ minHeight: "280px" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm backdrop-filter">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 transition-all shadow-lg">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Sample Report
                </Button>
              </div>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">Premium Valuation Report</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive market analysis with CARFAX® integration, condition assessment, and 12-month value prediction.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Complete Vehicle History</span>
                </div>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Market-Based Pricing Analysis</span>
                </div>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Depreciation Forecast</span>
                </div>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">Private & Dealer Valuations</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 flex items-center justify-center">
                <Download className="mr-2 h-4 w-4" />
                Download Sample
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="absolute -right-4 -top-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-12 z-10">
        Premium
      </div>
    </div>
  );
}

export default PdfPreview;
