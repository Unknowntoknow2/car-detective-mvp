
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function EmptyState() {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation History</CardTitle>
        <CardDescription>You haven't created any valuations yet</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="mb-4">Get started by creating your first vehicle valuation</p>
        <Button onClick={() => navigate('/lookup/vin')}>
          Start Valuation
        </Button>
      </CardContent>
    </Card>
  );
}
