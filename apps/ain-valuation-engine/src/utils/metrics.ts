/**
 * Prometheus metrics collection and monitoring utilities for the AIN Valuation Engine.
 * 
 * This module provides comprehensive performance monitoring capabilities using
 * Prometheus metrics, including HTTP requests, valuation operations, database
 * interactions, and system resource usage.
 * 
 * @module metrics
 * @requires prom-client - Prometheus client library for Node.js
 */

import promClient from 'prom-client';

/**
 * Prometheus metrics registry for collecting and exposing application metrics.
 * All custom metrics are registered here for centralized management.
 */
const register = new promClient.Registry();

// Add default Node.js metrics (CPU, memory, event loop, etc.)
promClient.collectDefaultMetrics({ register });

/**
 * Histogram metric tracking HTTP request duration across different endpoints.
 * 
 * Labels:
 * - method: HTTP method (GET, POST, etc.)
 * - route: Request route/path
 * - status_code: HTTP response status code
 * 
 * Buckets optimized for web application response times (100ms to 10s).
 */
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

/**
 * Counter metric tracking total number of HTTP requests by method, route, and status.
 * 
 * Used for monitoring request volume, error rates, and endpoint usage patterns.
 */
const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

/**
 * Counter metric tracking valuation request outcomes.
 * 
 * Labels:
 * - status: Request status (started, success, error)
 * 
 * Critical for monitoring valuation service health and success rates.
 */
const valuationRequestsTotal = new promClient.Counter({
  name: 'valuation_requests_total',
  help: 'Total number of valuation requests',
  labelNames: ['status']
});

/**
 * Histogram metric tracking valuation operation duration.
 * 
 * Buckets optimized for valuation processing times (500ms to 30s).
 * Essential for monitoring valuation service performance.
 */
const valuationDuration = new promClient.Histogram({
  name: 'valuation_duration_seconds',
  help: 'Duration of valuation requests in seconds',
  buckets: [0.5, 1, 2, 5, 10, 20, 30]
});

/**
 * Gauge metric tracking current number of active HTTP connections.
 * 
 * Important for monitoring server load and connection pooling efficiency.
 */
const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

/**
 * Counter metric tracking database operations by type, table, and outcome.
 * 
 * Labels:
 * - operation: Database operation type (insert, select, update, delete)
 * - table: Target database table
 * - status: Operation outcome (success, error)
 */
const databaseOperations = new promClient.Counter({
  name: 'database_operations_total',
  help: 'Total number of database operations',
  labelNames: ['operation', 'table', 'status']
});

/**
 * Counter metric tracking external API calls by service and outcome.
 * 
 * Labels:
 * - service: External service name (eia, fueleconomy, openai, etc.)
 * - status: Call outcome (success, error)
 * 
 * Critical for monitoring third-party service dependencies and failure rates.
 */
const apiCallsTotal = new promClient.Counter({
  name: 'external_api_calls_total',
  help: 'Total number of external API calls',
  labelNames: ['service', 'status']
});

/**
 * Gauge metric tracking Node.js memory usage by type.
 * 
 * Labels:
 * - type: Memory type (heapUsed, heapTotal, external, rss)
 * 
 * Essential for monitoring memory leaks and optimization opportunities.
 */
const memoryUsage = new promClient.Gauge({
  name: 'nodejs_memory_usage_bytes',
  help: 'Node.js memory usage in bytes',
  labelNames: ['type']
});

// Register all custom metrics with the Prometheus registry
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(valuationRequestsTotal);
register.registerMetric(valuationDuration);
register.registerMetric(activeConnections);
register.registerMetric(databaseOperations);
register.registerMetric(apiCallsTotal);
register.registerMetric(memoryUsage);

/**
 * Periodic memory usage update function.
 * 
 * Updates memory usage metrics every 10 seconds with current Node.js
 * memory consumption data from process.memoryUsage().
 */
setInterval(() => {
  const usage = process.memoryUsage();
  memoryUsage.set({ type: 'heapUsed' }, usage.heapUsed);
  memoryUsage.set({ type: 'heapTotal' }, usage.heapTotal);
  memoryUsage.set({ type: 'external' }, usage.external);
  memoryUsage.set({ type: 'rss' }, usage.rss);
}, 10000);

export {
  register,
  httpRequestDuration,
  httpRequestTotal,
  valuationRequestsTotal,
  valuationDuration,
  activeConnections,
  databaseOperations,
  apiCallsTotal,
  memoryUsage
};
