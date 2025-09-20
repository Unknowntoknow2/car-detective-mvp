import { Card, CardContent } from "@/components/ui/card";
import { FileBarChart } from "lucide-react";
import { CarfaxHighlights } from "./CarfaxHighlights";
import { motion } from "framer-motion";

interface PremiumValuationCardProps {
  vin?: string;
  valuationId?: string;
  valuationData?: {
    estimatedValue?: number;
    confidenceScore?: number;
    priceRange?: [number, number];
  };
  isLoading?: boolean;
}

export function PremiumValuationCard({
  vin,
  valuationId,
  valuationData,
  isLoading,
}: PremiumValuationCardProps) {
  const estimatedValue = valuationData?.estimatedValue ?? 0;
  const confidenceScore = valuationData?.confidenceScore ?? 0;

  return (
    <Card className="w-full max-w-md border-2 border-primary/20 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-primary flex items-center justify-center">
            <FileBarChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Premium Analysis</h3>
            <p className="text-sm text-text-secondary">CARFAX® Integration</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <h4 className="text-sm text-text-secondary font-medium mb-1">Estimated Value</h4>
              <motion.p
                className="text-2xl font-bold text-primary"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                ${estimatedValue.toLocaleString() || "-"}
              </motion.p>
            </div>
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <h4 className="text-sm text-text-secondary font-medium mb-1">Confidence</h4>
              <motion.p
                className="text-2xl font-bold text-success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {confidenceScore ? `${confidenceScore}%` : "-"}
              </motion.p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Feature Adjustments</span>
              <span className="font-medium">+$1,240</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-primary rounded-full"></div>
            </div>
          </div>

          <CarfaxHighlights 
            accidentCount={0}
            owners={1}
            serviceRecords={5}
          />
        </div>
      </CardContent>
    </Card>
  );
}
