
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, Search, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { populateMsrpsFromWebSearch } from '@/scripts/populateMsrpFromWeb';

export function MsrpPopulationPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<{
    total: number;
    populated: number;
    remaining: number;
  } | null>(null);

  const handleRunPopulation = async () => {
    setIsRunning(true);
    try {
      toast.info('Starting MSRP population from web sources...');
      await populateMsrpsFromWebSearch();
      toast.success('MSRP population completed successfully!');
    } catch (error) {
      toast.error('MSRP population failed. Check console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          MSRP Population Tool
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Use OpenAI to populate real MSRP values from web sources
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            Web-Powered
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Search className="w-3 h-3" />
            GPT-4o with Browsing
          </Badge>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Trims</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.populated}</div>
              <div className="text-xs text-muted-foreground">Populated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.remaining}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            onClick={handleRunPopulation}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Populating MSRP Data...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Start MSRP Population
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            ⚠️ This process uses OpenAI API and may take several minutes.
            Rate limited to avoid API throttling.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
