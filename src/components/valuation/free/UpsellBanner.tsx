
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function UpsellBanner() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold mb-2">
        Upgrade to Premium for full CARFAX report, multi-photo AI scoring & dealer offers
      </h3>
      <Button asChild size="lg" className="mt-4">
        <Link to="/premium">Try Premium for $29.99</Link>
      </Button>
    </div>
  );
}
