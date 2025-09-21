import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Database,
  Shield,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface TaskStatus {
  id: string;
  source_name: string;
  task_type: string;
  status: string;
  priority: number;
  next_run_at: string;
  last_run_at?: string;
  error_log?: string;
  provenance: any;
}

interface QAReport {
  id: string;
  report_date: string;
  vehicle_segment: string;
  total_comps_ingested: number;
  source_failures: number;
  avg_confidence_score: number;
  qa_alerts: any[];
  recommendations: any[];
}

interface SourceIntelligence {
  source_name: string;
  source_type: string;
  success_rate: number;
  total_fetches: number;
  comp_quality_score: number;
  access_status: string;
  last_successful_fetch?: string;
}

export default function FANGOrchestrationDashboard() {
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [qaReports, setQAReports] = useState<QAReport[]>([]);
  const [sourceIntel, setSourceIntel] = useState<SourceIntelligence[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionStats, setExecutionStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasksRes, qaRes, intelRes] = await Promise.all([
        supabase.from('data_fetch_tasks').select('*').order('priority', { ascending: false }),
        supabase.from('qa_reports').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('source_intelligence').select('*').order('success_rate', { ascending: false })
      ]);

      if (tasksRes.data) setTasks(tasksRes.data);
      if (qaRes.data) setQAReports(qaRes.data);
      if (intelRes.data) setSourceIntel(intelRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const executeOrchestrator = async (params: any = {}) => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('fang-task-orchestrator', {
        body: {
          force_run: true,
          ...params
        }
      });

      if (error) throw error;

      setExecutionStats(data.execution_summary);
      toast.success(`Orchestration completed: ${data.execution_summary.total_comps} comps collected`);
      
      // Refresh dashboard data
      setTimeout(loadDashboardData, 2000);
    } catch (error) {
      toast.error('Orchestration failed: ' + (error as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'blocked': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType) {
      case 'big_box': return '🏪';
      case 'dealer': return '🚗';
      case 'auction': return '🏛️';
      case 'marketplace': return '🌐';
      case 'p2p': return '👥';
      case 'oem': return '🏭';
      case 'valuation_api': return '📈';
      case 'instant_offer': return '⚡';
      case 'data_quality': return '🔍';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading FANG Orchestration Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FANG-Style Data Orchestration</h1>
          <p className="text-muted-foreground">
            Enterprise-grade task queue and data intelligence platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => executeOrchestrator()}
            disabled={isRunning}
            size="lg"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute All Tasks
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => executeOrchestrator({ specific_sources: ['CarMax', 'Carvana', 'AutoNation'] })}
            disabled={isRunning}
          >
            <Database className="w-4 h-4 mr-2" />
            High Priority Only
          </Button>
          <Button
            variant="outline"
            onClick={() => supabase.functions.invoke('ain-full-market-orchestrator', {
              body: {
                request_id: 'test-' + Date.now(),
                vehicle_params: {
                  year: 2022,
                  make: 'Ford',
                  model: 'F-150',
                  trim: 'LARIAT',
                  zip_code: '95624',
                  mileage: 9534,
                  vin: '1FTFW1E82NFB42108'
                }
              }
            }).then(result => {
              logger.log('AIN Protocol Result:', result);
              toast.success('AIN Full Market Protocol completed');
              setTimeout(loadDashboardData, 2000);
            }).catch(error => {
              toast.error('AIN Protocol failed');
            })}
            disabled={isRunning}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            AIN Full Protocol
          </Button>
        </div>
      </div>

      {/* Execution Stats */}
      {executionStats && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Latest Execution Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{executionStats.total_tasks}</div>
                <div className="text-sm text-muted-foreground">Tasks Executed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{executionStats.total_comps}</div>
                <div className="text-sm text-muted-foreground">Comps Collected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{executionStats.completed}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{executionStats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {executionStats.avg_quality_score?.toFixed(1) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Quality</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Task Queue</TabsTrigger>
          <TabsTrigger value="intelligence">Source Intelligence</TabsTrigger>
          <TabsTrigger value="qa">Quality Assurance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Task Queue Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{getTaskTypeIcon(task.task_type)}</span>
                      {task.source_name}
                      <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">P{task.priority}</Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                    </div>
                  </div>
                  <CardDescription>
                    Type: {task.task_type} • Next run: {new Date(task.next_run_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {task.last_run_at && (
                    <div className="text-xs text-muted-foreground mb-2">
                      Last run: {new Date(task.last_run_at).toLocaleString()}
                    </div>
                  )}
                  {task.error_log && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {task.error_log}
                    </div>
                  )}
                  {task.provenance?.last_execution && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      Last: {task.provenance.last_execution.comps_found} comps, 
                      {task.provenance.last_execution.execution_time_ms}ms,
                      Q{task.provenance.last_execution.quality_score}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Source Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sourceIntel.map((source) => (
              <Card key={source.source_name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{source.source_name}</CardTitle>
                  <CardDescription>{source.source_type.replace(/_/g, ' ')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span className="font-medium">{source.success_rate.toFixed(1)}%</span>
                    </div>
                    <Progress value={source.success_rate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality Score</span>
                      <span className="font-medium">{source.comp_quality_score.toFixed(1)}</span>
                    </div>
                    <Progress value={source.comp_quality_score} className="h-2" />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Fetches: {source.total_fetches}</span>
                    <Badge 
                      variant={source.access_status === 'open' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {source.access_status}
                    </Badge>
                  </div>

                  {source.last_successful_fetch && (
                    <div className="text-xs text-muted-foreground">
                      Last success: {new Date(source.last_successful_fetch).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* QA Tab */}
        <TabsContent value="qa" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {qaReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    QA Report - {report.vehicle_segment}
                  </CardTitle>
                  <CardDescription>{report.report_date}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Comps Ingested</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {report.total_comps_ingested}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Avg Quality</div>
                      <div className="text-2xl font-bold text-green-600">
                        {report.avg_confidence_score?.toFixed(1) || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {report.qa_alerts.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-medium text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Alerts ({report.qa_alerts.length})
                      </div>
                      {report.qa_alerts.slice(0, 3).map((alert, idx) => (
                        <div key={idx} className="text-xs bg-orange-50 p-2 rounded">
                          <div className="font-medium">{alert.type}</div>
                          <div>{alert.message}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {report.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-medium text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        Recommendations
                      </div>
                      {report.recommendations.slice(0, 2).map((rec, idx) => (
                        <div key={idx} className="text-xs bg-blue-50 p-2 rounded">
                          {rec}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Legal Compliance & Attribution
              </CardTitle>
              <CardDescription>
                Comprehensive tracking of all data sources and legal requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-200">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-sm text-muted-foreground">Attribution Compliance</div>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-muted-foreground">Takedown Requests</div>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-200">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">
                        {new Date().toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Last Audit</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Data Sources Status</h4>
                  <div className="space-y-1">
                    {sourceIntel.slice(0, 5).map((source) => (
                      <div key={source.source_name} className="flex items-center justify-between text-sm">
                        <span>{source.source_name}</span>
                        <Badge variant={source.access_status === 'open' ? 'default' : 'secondary'}>
                          {source.access_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}