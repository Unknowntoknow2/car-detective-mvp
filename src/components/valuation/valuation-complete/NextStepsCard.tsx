
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NextStepsCard() {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Next Steps</h3>
        <div className="space-y-3">
          <p className="text-sm">
            For a deeper analysis including market trends, dealer offers, and a comprehensive
            vehicle history report, upgrade to our premium service.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/premium')}>
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
