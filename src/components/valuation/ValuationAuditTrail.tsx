
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { AIConditionBadge } from './AIConditionBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export interface AdjustmentItem {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
}

export interface ValuationAuditTrailProps {
  auditTrail: {
    basePrice: number;
    adjustments: AdjustmentItem[];
    totalAdjustment: number;
    estimatedValue: number;
    timestamp: string;
    inputData: {
      year: number;
      make: string;
      model: string;
      mileage: number;
      condition: string;
    };
  };
  photoUrl?: string;
  aiCondition?: any;
}

export function ValuationAuditTrail({ auditTrail, photoUrl, aiCondition }: ValuationAuditTrailProps) {
  if (!auditTrail) return null;

  return (
    <Card className="border border-primary/10">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg">Valuation Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {photoUrl && (
          <div className="mb-4 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-md">
              <img src={photoUrl} alt="Vehicle" className="h-full w-full object-cover" />
            </div>
            {aiCondition && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">AI Condition Assessment</p>
                <AIConditionBadge 
                  condition={aiCondition.condition} 
                  confidenceScore={aiCondition.confidenceScore} 
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Base Price</h4>
            <p className="text-xl font-semibold">{formatCurrency(auditTrail.basePrice)}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Adjustments</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factor</TableHead>
                  <TableHead>Effect</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditTrail.adjustments.map((adj, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{adj.name}</TableCell>
                    <TableCell>{adj.description}</TableCell>
                    <TableCell className={`text-right ${adj.value > 0 ? 'text-green-600' : adj.value < 0 ? 'text-red-600' : ''}`}>
                      {adj.value > 0 ? '+' : ''}{formatCurrency(adj.value)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-medium">
                  <TableCell>Total Adjustments</TableCell>
                  <TableCell></TableCell>
                  <TableCell className={`text-right ${auditTrail.totalAdjustment > 0 ? 'text-green-600' : auditTrail.totalAdjustment < 0 ? 'text-red-600' : ''}`}>
                    {auditTrail.totalAdjustment > 0 ? '+' : ''}{formatCurrency(auditTrail.totalAdjustment)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Final Valuation</h4>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(auditTrail.estimatedValue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
