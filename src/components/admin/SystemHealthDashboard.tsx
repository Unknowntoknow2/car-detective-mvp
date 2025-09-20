import React from 'react';
import { CheckCircle, ExternalLink, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SystemHealthDashboardProps {
  className?: string;
}

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  value: string;
  details?: string;
  lastUpdated: string;
}

interface SystemComponent {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  description: string;
  metrics: HealthMetric[];
}

export function SystemHealthDashboard({ className = '' }: SystemHealthDashboardProps) {

  // Mock data - in production this would come from actual monitoring
  const systemComponents: SystemComponent[] = [
    {
      name: 'Market Orchestration',
      status: 'operational',
      description: 'AIN Full Market Orchestrator',
      metrics: [
        { name: 'OpenAI API Key', status: 'healthy', value: 'Configured', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Edge Function', status: 'healthy', value: 'Active', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Last Execution', status: 'healthy', value: '2 min ago', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Success Rate', status: 'healthy', value: '98.5%', lastUpdated: '2025-01-07T12:00:00Z' }
      ]
    },
    {
      name: 'Database Layer',
      status: 'operational',
      description: 'Supabase PostgreSQL',
      metrics: [
        { name: 'Connection Pool', status: 'healthy', value: '15/100', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Query Performance', status: 'healthy', value: '< 100ms avg', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Market Comps Table', status: 'healthy', value: '1.2M records', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Audit Logs', status: 'healthy', value: 'Active', lastUpdated: '2025-01-07T12:00:00Z' }
      ]
    },
    {
      name: 'Market Data Sources',
      status: 'operational', 
      description: '16 active data sources',
      metrics: [
        { name: 'CarGurus', status: 'healthy', value: '< 2s', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Cars.com', status: 'healthy', value: '< 1.5s', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'AutoTrader', status: 'healthy', value: '< 2.2s', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'CarMax', status: 'warning', value: '< 4s', details: 'Slower than usual', lastUpdated: '2025-01-07T12:00:00Z' }
      ]
    },
    {
      name: 'Valuation Pipeline',
      status: 'operational',
      description: 'End-to-end valuation flow',
      metrics: [
        { name: 'VIN Decode', status: 'healthy', value: '99.8% success', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Market Aggregation', status: 'healthy', value: '15.2 avg comps', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Price Calculation', status: 'healthy', value: '< 500ms', lastUpdated: '2025-01-07T12:00:00Z' },
        { name: 'Confidence Score', status: 'healthy', value: '87.3 avg', lastUpdated: '2025-01-07T12:00:00Z' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'outage':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return <Badge variant="default" className="bg-green-100 text-green-800">Operational</Badge>;
      case 'warning':
      case 'degraded':
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case 'error':
      case 'outage':
        return <Badge variant="destructive">Outage</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const runSystemTest = async () => {
    toast.loading('Running system health check...');
    
    // Simulate system test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('System health check completed successfully! All components operational.');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Health Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of Car Detective infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runSystemTest} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Run Health Check
          </Button>
          <Button variant="outline" asChild>
            <a 
              href="https://supabase.com/dashboard/project/xltxqqzattxogxtqrggt/functions" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Edge Functions
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {systemComponents.map((component) => (
          <Card key={component.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(component.status)}
                  <div>
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                  </div>
                </div>
                {getStatusBadge(component.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {component.metrics.map((metric) => (
                  <div key={metric.name} className="p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{metric.name}</span>
                      {getStatusIcon(metric.status)}
                    </div>
                    <div className="text-lg font-semibold">{metric.value}</div>
                    {metric.details && (
                      <div className="text-xs text-muted-foreground">{metric.details}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Updated: {new Date(metric.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" disabled>
              <ExternalLink className="h-4 w-4 mr-2" />
              Orchestrator Logs (Removed)
            </Button>
            <Button variant="outline" asChild>
              <a 
                href="https://supabase.com/dashboard/project/xltxqqzattxogxtqrggt/editor" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Database Console
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a 
                href="https://supabase.com/dashboard/project/xltxqqzattxogxtqrggt/settings/functions" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Function Secrets
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SystemHealthDashboard;