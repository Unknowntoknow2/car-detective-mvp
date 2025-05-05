
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: {
    factor: string;
    impact: number;
    description?: string;
  }[];
  aiVerified?: boolean;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
  } | null;
}

export function ValuationResults({
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments,
  aiVerified = false,
  aiCondition
}: ValuationResultsProps) {
  // Format currency with proper locale
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  // Animation variants for children
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper function to get confidence level text and color
  const getConfidenceInfo = (score: number) => {
    if (score >= 90) return { text: 'Very High', color: 'text-green-600' };
    if (score >= 80) return { text: 'High', color: 'text-green-500' };
    if (score >= 70) return { text: 'Good', color: 'text-yellow-500' };
    if (score >= 60) return { text: 'Moderate', color: 'text-yellow-600' };
    return { text: 'Low', color: 'text-red-500' };
  };

  const confidenceInfo = getConfidenceInfo(confidenceScore);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="mt-6 border border-primary/10 shadow-lg overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300">
        <CardContent className="space-y-6 pt-6">
          <motion.div variants={itemVariants} className="flex items-center gap-2 text-green-600">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full scale-[1.8] opacity-30 animate-pulse"></div>
              <CheckCircle2 className="w-5 h-5 relative z-10" />
            </div>
            <h3 className="text-lg font-semibold">Valuation Complete</h3>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="text-4xl font-bold text-primary tracking-tight relative"
          >
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatCurrency(estimatedValue)}
            </span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-help",
                    confidenceScore >= 80 ? "bg-green-50 text-green-600" : 
                    confidenceScore >= 70 ? "bg-yellow-50 text-yellow-600" : 
                    "bg-red-50 text-red-600"
                  )}>
                    {confidenceScore >= 70 ? 
                      <ShieldCheck className="h-3.5 w-3.5 opacity-70" /> : 
                      <AlertCircle className="h-3.5 w-3.5 opacity-70" />
                    }
                    {confidenceInfo.text} Confidence ({confidenceScore}%)
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">Confidence score indicates how certain we are about this valuation based on available data and market trends.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {aiCondition && aiCondition.confidenceScore >= 70 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-help">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      AI Verified Condition
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Our AI has analyzed vehicle photos and verified its condition with {aiCondition.confidenceScore}% confidence.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {priceRange && (
              <motion.div 
                variants={itemVariants}
                className="text-sm text-gray-700 flex items-center gap-1"
              >
                <span>Range:</span>
                <span className="font-medium">{formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}</span>
              </motion.div>
            )}
          </motion.div>

          {adjustments && adjustments.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="space-y-3 pt-2"
            >
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-gray-700">
                  Influencing Factors
                </h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">These factors have increased or decreased the base valuation of your vehicle.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2">
                {adjustments.map((adj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i * 0.05) }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "py-1 transition-all duration-200 cursor-help",
                              adj.impact > 0 
                                ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100/70' 
                                : 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100/70'
                            )}
                          >
                            {adj.factor}: {adj.impact > 0 ? "+" : ""}
                            {adj.impact}%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{adj.description || `Impact of ${adj.factor} on vehicle value`}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
