
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadPdf } from "@/utils/pdf";
import type { Valuation } from "@/types/valuation-history";

interface ValuationTableProps {
  valuations: Valuation[];
}

export function ValuationTable({ valuations }: ValuationTableProps) {
  const handleDownloadReport = (valuation: Valuation) => {
    const vehicleInfo = {
      make: valuation.make,
      model: valuation.model,
      year: valuation.year,
      vin: valuation.vin,
      plate: valuation.plate,
      state: valuation.state,
      isPremium: valuation.is_premium,
      estimatedValue: valuation.valuation || valuation.estimated_value || 0
    };
    
    downloadPdf(vehicleInfo);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Vehicle</TableHead>
          <TableHead>Identifier</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {valuations.map((valuation) => (
          <TableRow key={valuation.id}>
            <TableCell>
              {new Date(valuation.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {valuation.year} {valuation.make} {valuation.model}
            </TableCell>
            <TableCell>
              {valuation.vin ? 
                `VIN: ${valuation.vin.substring(0, 6)}...` : 
                valuation.plate ? `Plate: ${valuation.plate}${valuation.state ? ` (${valuation.state})` : ''}` : 'N/A'
              }
            </TableCell>
            <TableCell className="text-right">
              {(valuation.valuation || valuation.estimated_value) ? 
                `$${(valuation.valuation || valuation.estimated_value || 0).toLocaleString()}` : 
                'N/A'
              }
            </TableCell>
            <TableCell>
              {valuation.is_premium ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Premium
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Standard
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadReport(valuation)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
