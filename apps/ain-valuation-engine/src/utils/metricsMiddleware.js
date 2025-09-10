import { httpRequestDuration, httpRequestTotal, activeConnections } from './metrics';
// Middleware to track HTTP metrics
export function metricsMiddleware(req, res, next) {
    // Start timer for request duration
    req.timer = httpRequestDuration.startTimer({
        method: req.method,
        route: req.route?.path || req.path
    });
    // Increment active connections
    activeConnections.inc();
    // Handle response completion
    res.on('finish', () => {
        const labels = {
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.statusCode.toString()
        };
        // End timer and record duration
        if (req.timer) {
            req.timer(labels);
        }
        // Increment request counter
        httpRequestTotal.inc(labels);
        // Decrement active connections
        activeConnections.dec();
    });
    next();
}
// Middleware specifically for valuation operations
export function valuationMetricsWrapper(operation, operationType = 'unknown') {
    const timer = httpRequestDuration.startTimer({
        method: 'POST',
        route: '/valuation'
    });
    return operation()
        .then((result) => {
        timer({ status_code: '200' });
        return result;
    })
        .catch((error) => {
        timer({ status_code: '500' });
        throw error;
    });
}
