
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, CheckCircle, Users } from 'lucide-react';

interface CarfaxSummaryProps {
  carfaxData?: {
    ownerCount?: number;
    accidentCount?: number;
    serviceRecords?: number;
    titleIssues?: string[];
    lastServiceDate?: string;
  };
}

export function CarfaxSummary({ carfaxData }: CarfaxSummaryProps) {
  // If no CARFAX data, show placeholder for premium feature
  if (!carfaxData) {
    return (
      <Card className="premium-highlight bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            CARFAX® History
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-4 w-4" />
              <span>Full vehicle history report available</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <Users className="h-4 w-4" />
              <span>Ownership history and title records</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700">
              <FileText className="h-4 w-4" />
              <span>Service and maintenance records</span>
            </div>
            <p className="text-sm text-blue-600 mt-3">
              Premium users get access to comprehensive CARFAX® vehicle history data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-highlight bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <FileText className="h-5 w-5" />
          CARFAX® History
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Owners:</span>
              <span>{carfaxData.ownerCount || 'Unknown'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {(carfaxData.accidentCount || 0) > 0 ? (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="font-medium">Accidents:</span>
              <span>{carfaxData.accidentCount || 0}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Service Records:</span>
              <span>{carfaxData.serviceRecords || 0}</span>
            </div>
            
            {carfaxData.lastServiceDate && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Last Service:</span>
                <span className="text-sm">{carfaxData.lastServiceDate}</span>
              </div>
            )}
          </div>
        </div>
        
        {carfaxData.titleIssues && carfaxData.titleIssues.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Title Issues:</span>
            </div>
            <ul className="mt-2 text-sm text-yellow-700">
              {carfaxData.titleIssues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
