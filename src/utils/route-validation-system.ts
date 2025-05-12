
import { validateCriticalRoutes } from './route-validation';
import { enforceRouteIntegrity } from './route-validation/validateRoutes';
import { errorHandler } from './error-handling';

/**
 * Route Integrity System
 * 
 * This system ensures that critical routes are always available and properly configured.
 * It can be integrated into the application bootstrap process to validate route integrity
 * before the app renders, preventing blank pages and routing errors.
 */
export class RouteIntegritySystem {
  /**
   * Validates critical routes in the application
   * @param routes Application route configuration
   * @returns True if all critical routes are valid
   */
  static validateAppRoutes(routes: any): boolean {
    try {
      enforceRouteIntegrity(routes);
      return true;
    } catch (error) {
      errorHandler.handle(error, 'route-integrity-system');
      errorHandler.report({
        message: error instanceof Error ? error.message : 'Unknown route integrity error',
        code: 'ROUTE_INTEGRITY_ERROR',
        context: 'app-bootstrap',
        severity: 'critical',
        timestamp: new Date()
      });
      return false;
    }
  }

  /**
   * Initializes the route integrity system and performs validation
   * @param routes Application route configuration
   */
  static initialize(routes: any): void {
    console.info('🛡️ Initializing Route Integrity System...');
    
    const isValid = this.validateAppRoutes(routes);
    
    if (isValid) {
      console.info('✅ Route integrity check passed.');
    } else {
      console.error('❌ Route integrity check failed. See errors above.');
      
      // In development, we might want to throw, but in production
      // we'll just log the error and continue to avoid crashes
      if (process.env.NODE_ENV === 'development') {
        throw new Error('Route integrity check failed. See console for details.');
      }
    }
  }
}
