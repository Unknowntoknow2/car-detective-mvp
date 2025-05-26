
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  TrendingUp, 
  Shield, 
  Award, 
  Download, 
  Mail,
  CheckCircle,
  Info
} from 'lucide-react';

interface EnhancedValuationResultProps {
  baseValue: number;
  enhancedValue: number;
  confidenceScore: number;
  accuracyImprovement: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
    category: 'positive' | 'negative' | 'neutral';
  }>;
  followupData: Record<string, any>;
  onDownloadReport?: () => void;
  onEmailReport?: () => void;
}

export const EnhancedValuationResult: React.FC<EnhancedValuationResultProps> = ({
  baseValue,
  enhancedValue,
  confidenceScore,
  accuracyImprovement,
  adjustments,
  followupData,
  onDownloadReport,
  onEmailReport
}) => {
  const valueDifference = enhancedValue - baseValue;
  const percentageChange = ((valueDifference / baseValue) * 100);

  return (
    <div className="space-y-6">
      {/* Enhanced Badge */}
      <div className="text-center">
        <Badge variant="default" className="bg-gradient-to-r from-gold-500 to-yellow-500 text-white px-4 py-2 text-lg">
          <Award className="w-4 h-4 mr-2" />
          Enhanced Valuation Complete
        </Badge>
      </div>

      {/* Value Comparison */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Valuation Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Base Valuation</p>
              <p className="text-2xl font-bold text-gray-800">
                ${baseValue.toLocaleString()}
              </p>
              <Badge variant="outline">Standard Analysis</Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Enhanced Valuation</p>
              <p className="text-3xl font-bold text-blue-600">
                ${enhancedValue.toLocaleString()}
              </p>
              <Badge className="bg-blue-600 text-white">
                <Star className="w-3 h-3 mr-1" />
                Enhanced Analysis
              </Badge>
            </div>
          </div>
          
          {valueDifference !== 0 && (
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">Value Adjustment</p>
              <p className={`text-xl font-bold ${
                valueDifference > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {valueDifference > 0 ? '+' : ''}${valueDifference.toLocaleString()}
                <span className="text-sm ml-1">
                  ({percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%)
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confidence & Accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Confidence Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Accuracy Level</span>
                <span className="font-bold">{confidenceScore}%</span>
              </div>
              <Progress value={confidenceScore} className="h-3" />
              <p className="text-sm text-gray-600">
                Based on comprehensive vehicle analysis
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Accuracy Gain</span>
                <span className="font-bold text-blue-600">+{accuracyImprovement}%</span>
              </div>
              <Progress value={accuracyImprovement} className="h-3" />
              <p className="text-sm text-gray-600">
                Improvement from enhanced analysis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adjustment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adjustments.map((adjustment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${
                    adjustment.category === 'positive' ? 'bg-green-100' :
                    adjustment.category === 'negative' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <CheckCircle className={`h-4 w-4 ${
                      adjustment.category === 'positive' ? 'text-green-600' :
                      adjustment.category === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{adjustment.factor}</p>
                    <p className="text-sm text-gray-600">{adjustment.description}</p>
                  </div>
                </div>
                <div className={`font-bold ${
                  adjustment.impact > 0 ? 'text-green-600' : 
                  adjustment.impact < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {adjustment.impact > 0 ? '+' : ''}${adjustment.impact.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-gold-600" />
            Enhanced Analysis Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">Condition Assessment</h4>
              <p className="text-sm text-gray-600">Detailed condition analysis</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">History Verification</h4>
              <p className="text-sm text-gray-600">Maintenance & accident history</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Market Analysis</h4>
              <p className="text-sm text-gray-600">Current market trends</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {onDownloadReport && (
          <Button onClick={onDownloadReport} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        )}
        {onEmailReport && (
          <Button variant="outline" onClick={onEmailReport} className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Email Report
          </Button>
        )}
      </div>

      {/* Enhancement Summary */}
      <Card className="bg-gradient-to-r from-gold-50 to-yellow-50 border-gold-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-gold-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gold-900 mb-2">Enhanced Valuation Summary</h3>
              <p className="text-gold-800 text-sm">
                Your vehicle has been analyzed using our comprehensive enhancement process, 
                including condition assessment, maintenance history, and market data. 
                This provides a {accuracyImprovement}% improvement in valuation accuracy 
                with a {confidenceScore}% confidence score.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
