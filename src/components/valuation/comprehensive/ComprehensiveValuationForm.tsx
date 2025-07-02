import React, { useState } from 'react';
import { useValuationApi } from '@/hooks/useValuationApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ComprehensiveValuationFormProps {
  onResult?: (result: any) => void;
}

const AVAILABLE_SOURCES = [
  { id: 'Cars.com', name: 'Cars.com', type: 'marketplace' },
  { id: 'AutoTrader', name: 'AutoTrader', type: 'marketplace' },
  { id: 'CarGurus', name: 'CarGurus', type: 'marketplace' },
  { id: 'CarMax', name: 'CarMax', type: 'big_box' },
  { id: 'Carvana', name: 'Carvana', type: 'big_box' },
  { id: 'AutoNation', name: 'AutoNation', type: 'franchise_dealer' },
  { id: 'Lithia Motors', name: 'Lithia Motors', type: 'franchise_dealer' },
  { id: 'KBB', name: 'Kelley Blue Book', type: 'book_value' },
  { id: 'Edmunds', name: 'Edmunds', type: 'book_value' }
];

export function ComprehensiveValuationForm({ onResult }: ComprehensiveValuationFormProps) {
  const { isLoading, result, error, startFullValuation, sources, loadSources } = useValuationApi();
  
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    mileage: '',
    zip_code: '',
    condition: 'good'
  });

  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    loadSources();
  }, [loadSources]);

  React.useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(95, prev + Math.random() * 10));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setProgress(result ? 100 : 0);
    }
  }, [isLoading, result]);

  React.useEffect(() => {
    if (result) {
      onResult?.(result);
    }
  }, [result, onResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.year || !formData.make || !formData.model) {
      return;
    }

    setProgress(0);
    
    const valuationRequest = {
      year: parseInt(formData.year),
      make: formData.make,
      model: formData.model,
      trim: formData.trim || undefined,
      mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
      zip_code: formData.zip_code || undefined,
      condition: formData.condition,
      requested_by: 'web' as const,
      meta: {
        sources: selectedSources.length > 0 ? selectedSources : undefined,
        comprehensive: true
      }
    };

    await startFullValuation(valuationRequest);
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Comprehensive Market Valuation
          </CardTitle>
          <CardDescription>
            Get real-time market data from multiple sources using AI-powered web search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1990"
                  max="2025"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2022"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                  placeholder="Ford"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="F-150"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="trim">Trim (Optional)</Label>
                <Input
                  id="trim"
                  value={formData.trim}
                  onChange={(e) => setFormData(prev => ({ ...prev, trim: e.target.value }))}
                  placeholder="Lariat"
                />
              </div>
              
              <div>
                <Label htmlFor="mileage">Mileage (Optional)</Label>
                <Input
                  id="mileage"
                  type="number"
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                  placeholder="50000"
                />
              </div>
              
              <div>
                <Label htmlFor="zip_code">ZIP Code (Optional)</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                  placeholder="95661"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, condition: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Data Sources (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select specific sources or leave empty to search all sources
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {AVAILABLE_SOURCES.map((source) => (
                  <div key={source.id} className="flex items-center space-x-2">
                    <Badge 
                      variant={selectedSources.includes(source.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSource(source.id)}
                    >
                      {source.name}
                    </Badge>
                  </div>
                ))}
              </div>
              {selectedSources.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !formData.year || !formData.make || !formData.model}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing Market Data...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Get Comprehensive Valuation
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Aggregating market data...</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">
                Searching multiple sources for comparable vehicles. This may take a few minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Valuation Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-2xl font-bold">
                  ${result.estimated_value?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Confidence Score</p>
                <p className="text-2xl font-bold">{result.confidence_score || 'N/A'}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Comparable Listings</p>
                <p className="text-2xl font-bold">{result.comp_count || 0}</p>
              </div>
            </div>
            
            {result.price_range && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Price Range</p>
                <div className="flex justify-between">
                  <span>Low: ${result.price_range.low?.toLocaleString()}</span>
                  <span>High: ${result.price_range.high?.toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Source Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sources.map((source) => (
                <div key={source.name} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm font-medium">{source.name}</span>
                  <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                    {source.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}