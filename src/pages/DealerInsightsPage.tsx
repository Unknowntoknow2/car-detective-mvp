
import React from 'react';
import { useDealerInsights } from '@/hooks/useDealerInsights';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import DealerGuard from '@/guards/DealerGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, BarChart, PieChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4C5270'];

export default function DealerInsightsPage() {
  const { data, isLoading, error, refetch } = useDealerInsights();
  const { isPremium } = usePremiumDealer();
  
  const handleExportCSV = () => {
    if (!data) return;
    
    // Prepare data for CSV
    const offerRows = [
      ['Offer Metrics'],
      ['Total Offers', data.offerMetrics.totalOffers],
      ['Accepted Offers', data.offerMetrics.acceptedOffers],
      ['Rejected Offers', data.offerMetrics.rejectedOffers],
      ['Pending Offers', data.offerMetrics.pendingOffers],
      ['Average Offer Score', data.offerMetrics.avgOfferScore.toFixed(1)],
      [''],
      ['Offer Labels', 'Count'],
      ...data.offerMetrics.offersByLabel.map(item => [item.label, item.count]),
      [''],
      ['Lead Metrics'],
      ['Total Leads', data.leadMetrics.totalLeads],
      [''],
      ['Lead Source', 'Count'],
      ...data.leadMetrics.leadsBySource.map(item => [item.source, item.count]),
      [''],
      ['ZIP Code', 'Lead Count', 'Average Score'],
      ...data.leadMetrics.leadsByZip.map(item => [
        item.zip, 
        item.count, 
        item.avgScore ? item.avgScore.toFixed(1) : 'N/A'
      ])
    ];
    
    // Convert to CSV
    const csvContent = offerRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'dealer_insights.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading dealer insights...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            There was an error loading your insights data. Please try again later.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <Alert variant="default" className="mb-6">
          <AlertDescription>
            No insights data available. Submit offers to see analytics.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <DealerGuard>
      <div className="container max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dealer Insights</h1>
            <p className="text-muted-foreground">
              Analytics and performance data for your dealer account
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              Refresh Data
            </Button>
            <Button onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{data.offerMetrics.totalOffers}</CardTitle>
              <CardDescription>Total Offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {data.offerMetrics.acceptedOffers} accepted, {data.offerMetrics.rejectedOffers} rejected
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{data.leadMetrics.totalLeads}</CardTitle>
              <CardDescription>Total Leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Across {data.leadMetrics.leadsByZip.length} ZIP codes
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {data.offerMetrics.avgOfferScore ? data.offerMetrics.avgOfferScore.toFixed(1) : 'N/A'}
              </CardTitle>
              <CardDescription>Avg Offer Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Higher scores mean better offers
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            {isPremium && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Lead Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={data.leadMetrics.leadsBySource}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="source" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Offer Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={data.offerMetrics.offersByLabel}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="label"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.offerMetrics.offersByLabel.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="offers">
            <Card>
              <CardHeader>
                <CardTitle>Offers by Status</CardTitle>
                <CardDescription>
                  Breakdown of your offers by current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Pending', value: data.offerMetrics.pendingOffers },
                        { name: 'Accepted', value: data.offerMetrics.acceptedOffers },
                        { name: 'Rejected', value: data.offerMetrics.rejectedOffers }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Top ZIP Codes</CardTitle>
                <CardDescription>
                  Areas with the most customer activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ZIP Code</TableHead>
                      <TableHead>Lead Count</TableHead>
                      {isPremium && <TableHead>Avg Score</TableHead>}
                      {isPremium && <TableHead>Priority</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.leadMetrics.leadsByZip.slice(0, 5).map((zip) => (
                      <TableRow key={zip.zip}>
                        <TableCell className="font-medium">{zip.zip}</TableCell>
                        <TableCell>{zip.count}</TableCell>
                        {isPremium && (
                          <TableCell>
                            {zip.avgScore ? zip.avgScore.toFixed(1) : 'N/A'}
                          </TableCell>
                        )}
                        {isPremium && (
                          <TableCell>
                            {zip.count > 5 ? 'High' : zip.count > 2 ? 'Medium' : 'Low'}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {isPremium && (
            <TabsContent value="advanced">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time Analysis</CardTitle>
                    <CardDescription>
                      How quickly you respond to leads and its impact on conversions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data.timeMetrics ? (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:justify-around gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">
                              {data.timeMetrics.avgResponseTime.toFixed(1)} hrs
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Average Response Time
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">
                              {(data.offerMetrics.acceptedOffers / data.offerMetrics.totalOffers * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Acceptance Rate
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={data.timeMetrics.responseOverTime}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#4C5270" />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No response time data available yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DealerGuard>
  );
}
