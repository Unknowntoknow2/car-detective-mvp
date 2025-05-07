
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValuationCard } from '@/components/dealer/ValuationCard';
import { ConditionFilter, ConditionFilterOption } from '@/components/dealer/ConditionFilter';
import { useDealerValuations } from '@/hooks/useDealerValuations';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PremiumBadge } from '@/components/ui/premium-badge';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { ValuationWithCondition } from '@/types/dealer';

export function DealerValuationsList() {
  // Use the hook without parameters to get current user's valuations
  const {
    valuations,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    conditionFilter,
    handlePageChange,
    handleConditionFilterChange,
    handleDownloadReport
  } = useDealerValuations();

  // Calculate how many valuations have high confidence scores
  const highConfidenceCount = valuations.filter(v => 
    v.confidence_score ? v.confidence_score >= 85 : false
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Vehicle Valuations
            <span className="ml-2 text-sm text-muted-foreground">
              ({totalCount} total)
            </span>
          </h2>
          {highConfidenceCount > 0 && (
            <div className="mt-1 text-sm text-green-600 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {highConfidenceCount} vehicles with high confidence score
            </div>
          )}
        </div>
        <PremiumBadge variant="subtle">Dealer Dashboard</PremiumBadge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ConditionFilter 
            selectedFilter={conditionFilter} 
            onFilterChange={handleConditionFilterChange} 
          />
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Valuations</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-500">
                  {error}
                </div>
              ) : valuations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No valuations found with the selected filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {valuations.map((valuation) => (
                    <ValuationCard
                      key={valuation.id}
                      valuation={valuation as ValuationWithCondition}
                      aiCondition={valuation.aiCondition}
                      onDownload={() => handleDownloadReport(valuation)}
                    />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {!loading && totalCount > pageSize && (
                <div className="flex justify-center mt-6 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center mx-2">
                    <span className="text-sm">
                      Page {currentPage} of {Math.ceil(totalCount / pageSize)}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
