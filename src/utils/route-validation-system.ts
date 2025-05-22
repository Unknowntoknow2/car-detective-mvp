
import { validateRouteAccess, enforceRouteIntegrity } from './route-validation/validateRoutes';

/**
 * Route Validation System
 * Ensures route integrity and access control
 */
const RouteValidationSystem = {
  /**
   * Validate if a route can be accessed
   */
  validateAccess: (route: string, userRole?: string | null): boolean => {
    return validateRouteAccess(route, userRole);
  },
  
  /**
   * Check if a route has valid format and no security issues
   */
  validateIntegrity: (route: string): boolean => {
    return enforceRouteIntegrity(route);
  }
};

export default RouteValidationSystem;
