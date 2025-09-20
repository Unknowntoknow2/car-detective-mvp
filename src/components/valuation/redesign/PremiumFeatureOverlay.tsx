import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Crown, 
  Share2, 
  FileText,
  BarChart3,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  preview?: string;
  comingSoon?: boolean;
}

interface PremiumFeatureOverlayProps {
  isPremium: boolean;
  features: PremiumFeature[];
  onUpgrade: () => void;
  className?: string;
}

export function PremiumFeatureOverlay({
  isPremium,
  features,
  onUpgrade,
  className = ''
}: PremiumFeatureOverlayProps) {
  const defaultFeatures: PremiumFeature[] = [
    {
      id: 'pdf_download',
      title: 'PDF Reports',
      description: 'Download detailed valuation reports with market analysis',
      icon: FileText,
      preview: 'Professional PDF with charts and insights'
    },
    {
      id: 'advanced_sharing',
      title: 'Advanced Sharing',
      description: 'QR codes, social sharing, and custom links',
      icon: Share2,
      preview: 'Share via WhatsApp, Twitter, email'
    },
    {
      id: 'market_analytics',
      title: 'Market Analytics',
      description: 'Deep market insights and price predictions',
      icon: BarChart3,
      preview: 'Trend analysis and market forecasts'
    },
    {
      id: 'priority_support',
      title: 'Priority Support',
      description: 'Fast-track support and exclusive features',
      icon: Zap,
      preview: 'Direct access to our experts'
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  if (isPremium) {
    // Show unlocked premium features
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`space-y-4 ${className}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-amber-500" />
          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
            Premium Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.id} className="border-green-200 bg-green-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IconComponent className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Show locked premium features with upgrade CTA
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      {/* Frosted glass overlay */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/90 to-background/95 backdrop-blur-sm rounded-lg z-10" />
        
        <Card className="relative border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6 relative z-20">
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Crown className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
              <p className="text-muted-foreground text-sm">
                Get the most accurate valuations and exclusive insights
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {displayFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0.6, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Lock overlay for individual features */}
                    <div className="absolute top-2 right-2 z-30">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>

                    <Card className="h-full border-dashed border-muted-foreground/30 bg-background/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="w-4 h-4 text-primary/60" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {feature.description}
                            </p>
                            {feature.preview && (
                              <p className="text-xs text-primary/70 italic">
                                Preview: {feature.preview}
                              </p>
                            )}
                            {feature.comingSoon && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Upgrade CTA */}
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium px-8 py-3 text-base"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
              
              <p className="text-xs text-muted-foreground mt-3">
                ⚡ Instant access • 💰 Money-back guarantee • 🔒 Secure payment
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>PDF Reports</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Market Analytics</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Priority Support</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}