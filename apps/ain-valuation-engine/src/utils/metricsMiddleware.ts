import { Request, Response, NextFunction } from 'express';
import { 
  httpRequestDuration, 
  httpRequestTotal, 
  activeConnections 
} from './metrics';

interface RequestWithTimer extends Request {
  timer?: ReturnType<typeof httpRequestDuration.startTimer>;
}

// Middleware to track HTTP metrics
export function metricsMiddleware(req: RequestWithTimer, res: Response, next: NextFunction) {
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
export function valuationMetricsWrapper<T>(
  operation: () => Promise<T>,
  operationType: string = 'unknown'
): Promise<T> {
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
