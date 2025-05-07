import React, { useState } from 'react';
import { useNicbVinCheck } from '@/hooks/useNicbVinCheck';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { validateVIN } from '@/utils/validation/vin-validation';

export const NicbVinCheck: React.FC = () => {
  const [vinInput, setVinInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { checkVin, data, loading, error, source, fetchedAt, refresh } = useNicbVinCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation error
    setValidationError(null);
    
    // Validate VIN
    const validation = validateVIN(vinInput);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid VIN');
      return;
    }
    
    // Check VIN
    await checkVin(vinInput);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStatusBadge = () => {
    if (!data) return null;
    
    const hasIssues = data.is_stolen || data.has_title_issues;
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        hasIssues ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      }`}>
        {hasIssues ? (
          <>
            <XCircle className="h-4 w-4 mr-1" />
            Issues Found
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-1" />
            No Issues
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vin" className="block text-sm font-medium mb-1">
            Vehicle Identification Number (VIN)
          </label>
          <div className="flex space-x-2">
            <Input
              id="vin"
              value={vinInput}
              onChange={(e) => setVinInput(e.target.value.toUpperCase())}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className="font-mono"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Check VIN'}
            </Button>
          </div>
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}
        </div>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && !error && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>NICB VIN Check Results</CardTitle>
            {renderStatusBadge()}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">VIN</h3>
                <p className="font-mono">{data.vin}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Checked</h3>
                <p className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(data.last_checked)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reported Stolen</h3>
                <p className="flex items-center">
                  {data.is_stolen ? (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      Yes - {data.theft_date ? formatDate(data.theft_date) : 'Date Unknown'}
                    </span>
                  ) : (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Recovered</h3>
                <p className="flex items-center">
                  {data.is_recovered ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Yes - {data.recovery_date ? formatDate(data.recovery_date) : 'Date Unknown'}
                    </span>
                  ) : (
                    <span className="text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Title Issues</h3>
                <p className="flex items-center">
                  {data.has_title_issues ? (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      Yes
                    </span>
                  ) : (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      No
                    </span>
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data Source</h3>
                <p className="capitalize">{source || 'Unknown'}</p>
              </div>
            </div>

            {fetchedAt && (
              <div className="pt-4 border-t mt-4">
                <p className="text-xs text-gray-500 flex items-center justify-between">
                  <span>Data retrieved: {new Date(fetchedAt).toLocaleString()}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={refresh} 
                    disabled={loading}
                    className="h-8 px-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NicbVinCheck;
