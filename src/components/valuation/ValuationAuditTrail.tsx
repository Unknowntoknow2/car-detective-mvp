
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ValuationAuditTrail as AuditTrailType } from "@/utils/rules/RulesEngine";
import { formatCurrency } from "@/utils/formatters";

interface ValuationAuditTrailProps {
  auditTrail: AuditTrailType;
}

export function ValuationAuditTrail({ auditTrail }: ValuationAuditTrailProps) {
  if (!auditTrail) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Valuation Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
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
