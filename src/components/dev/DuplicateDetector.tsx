
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { detectDuplicates, generateDuplicateReport, DuplicatePattern } from '@/utils/duplicateDetector';
import { AlertTriangle, FileCode, Copy, CheckCircle } from 'lucide-react';

export function DuplicateDetector() {
  const [duplicates, setDuplicates] = useState<DuplicatePattern[]>([]);
  const [showReport, setShowReport] = useState(false);

  const runDetection = () => {
    const found = detectDuplicates();
    setDuplicates(found);
    setShowReport(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <FileCode className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <FileCode className="w-4 h-4" />;
    }
  };

  const copyReport = () => {
    const report = generateDuplicateReport();
    navigator.clipboard.writeText(report);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5" />
            Duplicate Code Detector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={runDetection}>
              Scan for Duplicates
            </Button>
            {showReport && (
              <Button variant="outline" onClick={copyReport}>
                Copy Report
              </Button>
            )}
          </div>

          {showReport && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-sm">
                  <strong>Total duplicates found:</strong> {duplicates.length}
                </div>
                <div className="text-sm">
                  <strong>High priority:</strong> {duplicates.filter(d => d.severity === 'high').length}
                </div>
                <div className="text-sm">
                  <strong>Medium priority:</strong> {duplicates.filter(d => d.severity === 'medium').length}
                </div>
                <div className="text-sm">
                  <strong>Low priority:</strong> {duplicates.filter(d => d.severity === 'low').length}
                </div>
              </div>

              <div className="space-y-4">
                {duplicates.map((duplicate, index) => (
                  <Card key={index} className="border-l-4 border-l-slate-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(duplicate.severity)}
                          <h3 className="font-semibold">{duplicate.description}</h3>
                        </div>
                        <Badge variant={getSeverityColor(duplicate.severity) as any}>
                          {duplicate.severity} priority
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <strong>Type:</strong> {duplicate.type}
                        </div>
                        
                        <div>
                          <strong>Files:</strong>
                          <ul className="mt-1 ml-4 space-y-1">
                            {duplicate.files.map((file, fileIndex) => (
                              <li key={fileIndex} className="text-sm font-mono text-slate-600">
                                {file}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {duplicate.suggestion && (
                          <div className="p-3 bg-blue-50 rounded-md">
                            <strong>Suggestion:</strong> {duplicate.suggestion}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
