import * as React from 'react';
/**
 * Production monitoring and error tracking utilities
 */

// Global type declarations
declare global {
  interface Window {
    Sentry?: {
      withScope: (callback: (scope: any) => void) => void;
      captureException: (error: Error) => void;
    };
    gtag?: (command: string, action: string, parameters?: Record<string, any>) => void;
  }
}

interface ErrorContext {
  userId?: string;
  valuationId?: string;
  action?: string;
  component?: string;
  additionalData?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private isDevelopment = import.meta.env.NODE_ENV === 'development';
  private metricsBuffer: PerformanceMetric[] = [];
  private readonly BUFFER_SIZE = 100;

  /**
   * Log errors to monitoring service (Sentry, etc.)
   */
  logError(error: Error, context?: ErrorContext) {
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });

    // In production, send to Sentry or other monitoring service
    if (!this.isDevelopment && window.Sentry) {
      window.Sentry.withScope((scope) => {
        if (context?.userId) scope.setUser({ id: context.userId });
        if (context?.component) scope.setTag('component', context.component);
        if (context?.action) scope.setTag('action', context.action);
        if (context?.valuationId) scope.setTag('valuationId', context.valuationId);
        if (context?.additionalData) {
          Object.entries(context.additionalData).forEach(([key, value]) => {
            scope.setExtra(key, value);
          });
        }
        window.Sentry?.captureException(error);
      });
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    };

    this.metricsBuffer.push(metric);

    // Keep buffer size manageable
    if (this.metricsBuffer.length > this.BUFFER_SIZE) {
      this.metricsBuffer = this.metricsBuffer.slice(-this.BUFFER_SIZE);
    }

    if (this.isDevelopment) {
      console.log('Performance Metric:', metric);
    }

    // In production, send to analytics service
    if (!this.isDevelopment && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name,
        value: Math.round(value),
        ...metadata,
      });
    }
  }

  /**
   * Track user actions for analytics
   */
  trackEvent(event: string, properties?: Record<string, any>) {
    if (this.isDevelopment) {
      console.log('Event Tracked:', { event, properties });
    }

    // Send to analytics service in production
    if (!this.isDevelopment && window.gtag) {
      window.gtag('event', event, properties);
    }
  }

  /**
   * Monitor API response times
   */
  async trackAPICall<T>(
    apiName: string,
    apiCall: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      this.trackPerformance(`api_${apiName}`, duration, {
        status: 'success',
        ...context,
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.trackPerformance(`api_${apiName}`, duration, {
        status: 'error',
        ...context,
      });
      
      this.logError(error as Error, {
        action: `api_call_${apiName}`,
        component: 'api_client',
        additionalData: context,
      });
      
      throw error;
    }
  }

  /**
   * Get performance metrics for debugging
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metricsBuffer];
  }

  /**
   * Clear metrics buffer
   */
  clearMetrics() {
    this.metricsBuffer = [];
  }

  /**
   * Monitor component render performance
   */
  trackComponentRender(componentName: string, renderTime: number) {
    this.trackPerformance(`component_render_${componentName}`, renderTime);
  }

  /**
   * Monitor page load performance
   */
  trackPageLoad(pageName: string) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: 0,
        firstContentfulPaint: 0,
      };

      // Get paint metrics if available
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      });

      this.trackPerformance(`page_load_${pageName}`, metrics.loadTime, {
        ...metrics,
        page: pageName,
      });
    }
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();

// React hook for component monitoring
export function useMonitoring() {
  return {
    logError: monitoring.logError.bind(monitoring),
    trackEvent: monitoring.trackEvent.bind(monitoring),
    trackPerformance: monitoring.trackPerformance.bind(monitoring),
    trackAPICall: monitoring.trackAPICall.bind(monitoring),
  };
}

// Higher-order component for error boundary monitoring
export function withErrorMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function MonitoredComponent(props: P) {
    const startTime = performance.now();

    if (typeof React !== 'undefined' && React.useEffect) {
      React.useEffect(() => {
        const renderTime = performance.now() - startTime;
        monitoring.trackComponentRender(componentName, renderTime);
      }, []);
    }

    return React.createElement(Component, props);
  };
}

export default monitoring;
