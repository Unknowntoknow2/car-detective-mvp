
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, RefreshCw } from 'lucide-react';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { CDButton } from '@/components/ui-kit/CDButton';
import { BodyS, HeadingL, HeadingM } from '@/components/ui-kit/typography';
import ValuationTable from './components/ValuationTable';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';
import { toast } from 'sonner';
import styles from './styles';

export function QADashboardPage() {
  const navigate = useNavigate();
  const { isAdmin, isCheckingRole } = useAdminRole();
  const [valuations, setValuations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [healthStats, setHealthStats] = useState({
    gptExplanationRate: 0,
    photoScoringRate: 0,
    pdfSuccessRate: 0,
    paymentMatchRate: 0,
    totalValuations: 0
  });
  
  const [filters, setFilters] = useState({
    dateRange: '30', // days
    sourceType: 'all',
    premiumStatus: 'all',
    minConfidence: 0,
  });

  // Check if user is authorized
  useEffect(() => {
    if (!isCheckingRole && !isAdmin) {
      toast.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [isAdmin, isCheckingRole, navigate]);

  // Fetch valuations data
  useEffect(() => {
    if (isAdmin) {
      fetchValuations();
    }
  }, [isAdmin, filters]);

  const fetchValuations = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range
      const daysAgo = parseInt(filters.dateRange) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      
      // Build the query
      let query = supabase
        .from('valuations')
        .select(`
          *,
          valuation_photos(count),
          orders(count)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      // Apply filters
      if (filters.sourceType === 'vin') {
        query = query.not('vin', 'is', null);
      } else if (filters.sourceType === 'plate') {
        query = query.not('plate', 'is', null).is('vin', null);
      } else if (filters.sourceType === 'manual') {
        query = query.is('vin', null).is('plate', null);
      }
      
      if (filters.premiumStatus === 'premium') {
        query = query.eq('premium_unlocked', true);
      } else if (filters.premiumStatus === 'free') {
        query = query.eq('premium_unlocked', false);
      }
      
      if (filters.minConfidence > 0) {
        query = query.gte('confidence_score', filters.minConfidence);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data
      const transformedData = data.map(item => ({
        ...item,
        has_gpt_explanation: true, // This would be pulled from a real column if available
        has_photo_score: item.valuation_photos?.count > 0,
        has_pdf_export: true, // This would be pulled from a real column if available
      }));
      
      setValuations(transformedData);
      
      // Calculate health stats
      const totalCount = transformedData.length;
      const gptCount = transformedData.filter(v => v.has_gpt_explanation).length;
      const photoCount = transformedData.filter(v => v.has_photo_score).length;
      const pdfCount = transformedData.filter(v => v.has_pdf_export).length;
      const paymentCount = transformedData.filter(v => v.premium_unlocked && v.orders?.count > 0).length;
      const premiumCount = transformedData.filter(v => v.premium_unlocked).length;
      
      setHealthStats({
        gptExplanationRate: totalCount > 0 ? (gptCount / totalCount) * 100 : 0,
        photoScoringRate: totalCount > 0 ? (photoCount / totalCount) * 100 : 0,
        pdfSuccessRate: totalCount > 0 ? (pdfCount / totalCount) * 100 : 0,
        paymentMatchRate: premiumCount > 0 ? (paymentCount / premiumCount) * 100 : 0,
        totalValuations: totalCount
      });
    } catch (error) {
      console.error('Error fetching valuations:', error);
      toast.error('Failed to fetch valuation data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderStatCard = (title, percentage, color = "primary") => (
    <div className={styles.stats.card}>
      <BodyS className={styles.stats.title}>{title}</BodyS>
      <div className={styles.stats.value}>{percentage.toFixed(1)}%</div>
      <div className={styles.stats.progressContainer}>
        <div 
          className={styles.stats.progressBar(percentage, color)}
          style={{ width: `${Math.max(percentage, 3)}%` }} 
        />
      </div>
    </div>
  );

  // If still checking admin role or not an admin, show loading
  if (isCheckingRole || !isAdmin) {
    return <div className="p-8 text-center">Checking access...</div>;
  }

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <div>
          <HeadingL as="h1">QA Dashboard</HeadingL>
          <BodyS className="text-neutral-dark">
            System health check and valuation diagnostics ({healthStats.totalValuations} valuations)
          </BodyS>
        </div>
        <CDButton 
          variant="outline" 
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={fetchValuations}
          isLoading={isLoading}
        >
          Refresh Data
        </CDButton>
      </motion.div>

      <motion.div 
        className={styles.healthGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {renderStatCard("GPT Explanation Rate", healthStats.gptExplanationRate, healthStats.gptExplanationRate > 90 ? "success" : "warning")}
        {renderStatCard("Photo Scoring Rate", healthStats.photoScoringRate, healthStats.photoScoringRate > 80 ? "success" : "warning")}
        {renderStatCard("PDF Success Rate", healthStats.pdfSuccessRate, healthStats.pdfSuccessRate > 95 ? "success" : "error")}
        {renderStatCard("Payment Match Rate", healthStats.paymentMatchRate, healthStats.paymentMatchRate > 90 ? "success" : "error")}
      </motion.div>

      <motion.div 
        className={styles.filterBar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-neutral-dark" />
          <HeadingM className="text-base">Filters</HeadingM>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className={styles.filterGroup}>
            <label className="text-sm font-medium text-neutral-dark">Date Range</label>
            <select 
              className="rounded-md border border-neutral-light px-3 py-1 text-sm"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className="text-sm font-medium text-neutral-dark">Source Type</label>
            <select 
              className="rounded-md border border-neutral-light px-3 py-1 text-sm"
              value={filters.sourceType}
              onChange={(e) => handleFilterChange('sourceType', e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="vin">VIN Only</option>
              <option value="plate">Plate Only</option>
              <option value="manual">Manual Only</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className="text-sm font-medium text-neutral-dark">Premium Status</label>
            <select 
              className="rounded-md border border-neutral-light px-3 py-1 text-sm"
              value={filters.premiumStatus}
              onChange={(e) => handleFilterChange('premiumStatus', e.target.value)}
            >
              <option value="all">All</option>
              <option value="premium">Premium Only</option>
              <option value="free">Free Only</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className="text-sm font-medium text-neutral-dark">Min Confidence</label>
            <select 
              className="rounded-md border border-neutral-light px-3 py-1 text-sm"
              value={filters.minConfidence}
              onChange={(e) => handleFilterChange('minConfidence', e.target.value)}
            >
              <option value="0">Any Confidence</option>
              <option value="50">50% or higher</option>
              <option value="70">70% or higher</option>
              <option value="90">90% or higher</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ValuationTable 
          valuations={valuations}
          isLoading={isLoading}
          onRefresh={fetchValuations}
        />
      </motion.div>
    </div>
  );
}

export default QADashboardPage;
