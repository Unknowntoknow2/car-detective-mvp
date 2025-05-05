
import { Badge } from '@/components/ui/badge';
import { PremiumBadge } from '@/components/ui/premium-badge';

interface PhotoHeaderProps {
  isPremium?: boolean;
}

export function PhotoHeader({ isPremium = false }: PhotoHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">Vehicle Photo Analysis</h3>
      {isPremium ? (
        <PremiumBadge variant="outline" size="md" />
      ) : (
        <Badge variant="outline" className="bg-primary/10">AI-Powered</Badge>
      )}
    </div>
  );
}
