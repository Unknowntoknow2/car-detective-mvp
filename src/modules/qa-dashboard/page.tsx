
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CDButton } from '@/components/ui-kit/CDButton';
import { Slider } from '@/components/ui/slider';
import { ProgressRing } from '@/components/animations/ProgressRing';
import { ValuationTable } from './components/ValuationTable';
import styles from './styles';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// QA Dashboard page component
const QADashboardPage = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [dateRange, setDateRange] = useState('7days');
  const [sourceType, setSourceType] = useState('all');
  const [premiumFilter, setPremiumFilter] = useState('all');
  const [confidenceRange, setConfidenceRange] = useState([0, 100]);

  // Check authorization
  useEffect(() => {
    const checkAuthorization = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAuthorized(false);
        return;
      }
      
      // For now, we'll use a simple check based on email
      // In production, this should check Supabase RLS policies
      const isAdmin = user.email === 'admin@cardetective.ai';
      setIsAuthorized(isAdmin);
      
      if (!isAdmin) {
        toast.error('You are not authorized to access this page');
        navigate('/');
      }
    };
    
    checkAuthorization();
  }, [navigate]);

  // Calculate date filter
  const getDateFilter = () => {
    const now = new Date();
    
    switch(dateRange) {
      case '24hours':
        const yesterday = new Date(now);
        yesterday.setHours(now.getHours() - 24);
        return yesterday.toISOString();
      case '7days':
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        return lastWeek.toISOString();
      case '30days':
        const lastMonth = new Date(now);
        lastMonth.setDate(now.getDate() - 30);
        return lastMonth.toISOString();
      default:
        return null;
    }
  };

  // Fetch health metrics
  const { data: healthMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['health-metrics'],
    queryFn: async () => {
      // GPT explanations count
      const { data: gptExplanations, error: gptError } = await supabase
        .from('valuations')
        .select('count')
        .not('explanation', 'is', null);
      
      // Total valuations
      const { data: totalValuations, error: totalError } = await supabase
        .from('valuations')
        .select('count');
      
      // Photo scoring count
      const { data: photoScoring, error: photoError } = await supabase
        .from('valuation_photos')
        .select('count')
        .not('score', 'is', null);
      
      // PDF generation success
      const { data: pdfSuccess, error: pdfError } = await supabase
        .from('pdf_exports')
        .select('count')
        .eq('status', 'success');
      
      const { data: totalPdfs, error: totalPdfsError } = await supabase
        .from('pdf_exports')
        .select('count');
      
      // Premium upgrades
      const { data: premiumPayments, error: paymentsError } = await supabase
        .from('stripe_payments')
        .select('count')
        .eq('status', 'success');
      
      const { data: premiumValuations, error: premiumError } = await supabase
        .from('valuations')
        .select('count')
        .eq('is_premium', true);
      
      return {
        gptExplanationRate: totalValuations?.[0]?.count > 0 
          ? (gptExplanations?.[0]?.count / totalValuations[0].count) * 100 
          : 0,
        photoScoringRate: totalValuations?.[0]?.count > 0 
          ? (photoScoring?.[0]?.count / totalValuations[0].count) * 100 
          : 0,
        pdfSuccessRate: totalPdfs?.[0]?.count > 0 
          ? (pdfSuccess?.[0]?.count / totalPdfs[0].count) * 100 
          : 0,
        paymentMatchRate: premiumValuations?.[0]?.count > 0 
          ? (premiumPayments?.[0]?.count / premiumValuations[0].count) * 100 
          : 0
      };
    }
  });

  // Fetch valuations
  const { data: valuations, isLoading: isLoadingValuations } = useQuery({
    queryKey: ['qa-valuations', dateRange, sourceType, premiumFilter, confidenceRange],
    queryFn: async () => {
      let query = supabase
        .from('valuations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      // Apply date filter
      const dateFilter = getDateFilter();
      if (dateFilter) {
        query = query.gt('created_at', dateFilter);
      }
      
      // Apply source type filter
      if (sourceType !== 'all') {
        query = query.eq('source_type', sourceType);
      }
      
      // Apply premium filter
      if (premiumFilter === 'premium') {
        query = query.eq('is_premium', true);
      } else if (premiumFilter === 'free') {
        query = query.eq('is_premium', false);
      }
      
      // Apply confidence range filter
      query = query
        .gte('confidence_score', confidenceRange[0])
        .lte('confidence_score', confidenceRange[1]);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching valuations:', error);
        throw new Error(error.message);
      }
      
      return data;
    }
  });

  // Action handlers
  const handleViewResult = (id: string) => {
    window.open(`/valuation/${id}`, '_blank');
  };
  
  const handleRerunGPT = async (id: string) => {
    toast.success(`Requested rerun of GPT for valuation ${id}`);
    // This would trigger a cloud function or backend process to rerun the GPT explanation
  };
  
  const handleGeneratePDF = async (id: string) => {
    toast.success(`Requested PDF generation for valuation ${id}`);
    // This would trigger PDF generation
  };
  
  const handleDownloadPDF = async (id: string) => {
    toast.success(`Downloading PDF for valuation ${id}`);
    // This would fetch and download the PDF
  };
  
  const handleViewStripeStatus = (id: string) => {
    toast.success(`Viewing Stripe status for valuation ${id}`);
    // This would show Stripe payment details
  };

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Checking authorization...</span>
        </div>
      </div>
    );
  }

  // Not authorized state
  if (isAuthorized === false) {
    return (
      <div className={styles.container}>
        <CDCard>
          <CDCardBody>
            <div className="flex items-center text-error">
              <AlertCircle className="h-8 w-8 mr-2" />
              <div>
                <h2 className="text-xl font-bold">Not Authorized</h2>
                <p>You do not have permission to access this page.</p>
              </div>
            </div>
          </CDCardBody>
        </CDCard>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="text-2xl font-bold">QA Dashboard</h1>
          <p className="text-neutral-dark">Monitor and validate all system-critical flows</p>
        </div>
        <div className="flex gap-2">
          <CDButton
            variant="outline"
            onClick={() => navigate('/')}
          >
            Exit
          </CDButton>
        </div>
      </header>

      {/* Health metrics grid */}
      <div className={styles.healthGrid}>
        <CDCard className={styles.stats.card}>
          <div className={styles.stats.title}>GPT Explanations</div>
          <div className="flex items-center gap-4">
            <ProgressRing
              value={isLoadingMetrics ? 0 : healthMetrics?.gptExplanationRate || 0}
              size={70}
              strokeWidth={6}
              color="#3B82F6"
              duration={1}
            >
              <span className="text-lg font-bold">
                {isLoadingMetrics ? '-' : `${Math.round(healthMetrics?.gptExplanationRate || 0)}%`}
              </span>
            </ProgressRing>
            <div className="text-sm">
              <div className="font-medium">Target: 100%</div>
              <div className="text-neutral-dark">All valuations have GPT explanations</div>
            </div>
          </div>
        </CDCard>

        <CDCard className={styles.stats.card}>
          <div className={styles.stats.title}>Photo Scoring</div>
          <div className="flex items-center gap-4">
            <ProgressRing
              value={isLoadingMetrics ? 0 : healthMetrics?.photoScoringRate || 0}
              size={70}
              strokeWidth={6}
              color="#10B981"
              duration={1.2}
            >
              <span className="text-lg font-bold">
                {isLoadingMetrics ? '-' : `${Math.round(healthMetrics?.photoScoringRate || 0)}%`}
              </span>
            </ProgressRing>
            <div className="text-sm">
              <div className="font-medium">Target: 80%+</div>
              <div className="text-neutral-dark">Photos have AI scoring</div>
            </div>
          </div>
        </CDCard>

        <CDCard className={styles.stats.card}>
          <div className={styles.stats.title}>PDF Success Rate</div>
          <div className="flex items-center gap-4">
            <ProgressRing
              value={isLoadingMetrics ? 0 : healthMetrics?.pdfSuccessRate || 0}
              size={70}
              strokeWidth={6}
              color="#F59E0B"
              duration={1.4}
            >
              <span className="text-lg font-bold">
                {isLoadingMetrics ? '-' : `${Math.round(healthMetrics?.pdfSuccessRate || 0)}%`}
              </span>
            </ProgressRing>
            <div className="text-sm">
              <div className="font-medium">Target: 95%+</div>
              <div className="text-neutral-dark">PDF generation success</div>
            </div>
          </div>
        </CDCard>

        <CDCard className={styles.stats.card}>
          <div className={styles.stats.title}>Payment Match</div>
          <div className="flex items-center gap-4">
            <ProgressRing
              value={isLoadingMetrics ? 0 : healthMetrics?.paymentMatchRate || 0}
              size={70}
              strokeWidth={6}
              color="#6366F1"
              duration={1.6}
            >
              <span className="text-lg font-bold">
                {isLoadingMetrics ? '-' : `${Math.round(healthMetrics?.paymentMatchRate || 0)}%`}
              </span>
            </ProgressRing>
            <div className="text-sm">
              <div className="font-medium">Target: 100%</div>
              <div className="text-neutral-dark">Premium access payment matches</div>
            </div>
          </div>
        </CDCard>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className="text-sm font-medium">Date Range</label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Last 24 Hours</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={styles.filterGroup}>
          <label className="text-sm font-medium">Source Type</label>
          <Select value={sourceType} onValueChange={setSourceType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="vin">VIN Only</SelectItem>
              <SelectItem value="plate">Plate Only</SelectItem>
              <SelectItem value="manual">Manual Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={styles.filterGroup}>
          <label className="text-sm font-medium">Premium Status</label>
          <Select value={premiumFilter} onValueChange={setPremiumFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Valuations</SelectItem>
              <SelectItem value="premium">Premium Only</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto flex-1">
          <label className="text-sm font-medium block mb-2">Confidence Score: {confidenceRange[0]}% - {confidenceRange[1]}%</label>
          <Slider 
            value={confidenceRange}
            min={0}
            max={100}
            step={5}
            onValueChange={setConfidenceRange}
            className="w-full"
          />
        </div>
      </div>

      {/* Valuations table */}
      <div className={styles.tableContainer}>
        <ValuationTable
          valuations={valuations || []}
          isLoading={isLoadingValuations}
          onViewResult={handleViewResult}
          onRerunGPT={handleRerunGPT}
          onGeneratePDF={handleGeneratePDF}
          onDownloadPDF={handleDownloadPDF}
          onViewStripeStatus={handleViewStripeStatus}
        />
      </div>
    </div>
  );
};

export default QADashboardPage;
