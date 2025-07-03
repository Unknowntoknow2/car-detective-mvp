
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SocialShareButtons } from '@/components/sharing/SocialShareButtons';
import { usePublicShare } from '@/hooks/usePublicShare';

interface EnhancedValuationResultProps {
  valuationId: string;
  vehicleInfo: any;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: any[];
}

export const EnhancedValuationResult: React.FC<EnhancedValuationResultProps> = ({
  valuationId,
  estimatedValue,
  confidenceScore,
  vehicleInfo
}) => {
  const { generatePublicToken } = usePublicShare();
  const [publicToken, setPublicToken] = useState<string>();

  const handleGenerateToken = async (): Promise<string> => {
    const token = await generatePublicToken(valuationId);
    setPublicToken(token);
    return token;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Valuation Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Vehicle</h3>
              <p>{vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model}</p>
            </div>
            <div>
              <h3 className="font-semibold">Estimated Value</h3>
              <p className="text-2xl font-bold text-primary">
                ${estimatedValue.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Confidence Score</h3>
              <p className="text-lg">{confidenceScore}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <SocialShareButtons
        valuationId={valuationId}
        publicToken={publicToken}
        vehicleInfo={{
          year: vehicleInfo?.year || 0,
          make: vehicleInfo?.make || '',
          model: vehicleInfo?.model || '',
          estimatedValue: estimatedValue || 0,
        }}
        onGenerateToken={handleGenerateToken}
      />
    </div>
  );
};

export default EnhancedValuationResult;
