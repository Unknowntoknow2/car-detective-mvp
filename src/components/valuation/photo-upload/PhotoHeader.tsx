
import { Badge } from '@/components/ui/badge';

export function PhotoHeader() {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">Vehicle Photo Analysis</h3>
      <Badge variant="outline" className="bg-primary/10">AI-Powered</Badge>
    </div>
  );
}
