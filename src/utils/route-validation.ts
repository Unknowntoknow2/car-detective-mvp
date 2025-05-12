
/**
 * Route validation utility to ensure critical routes exist
 * and detect potential breaking changes to routing
 */

// Define the critical routes that must exist
const CRITICAL_ROUTES = [
  '/',
  '/login',
  '/register',
  '/dealer-dashboard',
  '/dealer-insights',
  '/premium',
  '/view-offer/:token',
  '/share/:token',
  '/payment/success',
  '/payment/cancelled',
];

/**
 * Validates that all critical routes are present in the application
 * @param currentRoutes Array of current route paths
 * @returns Object with validation status and missing routes if any
 */
export function validateCriticalRoutes(currentRoutes: string[]): { valid: boolean; missing: string[] } {
  const missingRoutes = CRITICAL_ROUTES.filter(
    criticalRoute => !currentRoutes.some(route => {
      // Handle parameterized routes by checking prefix up to ':'
      if (criticalRoute.includes(':') && route.includes(':')) {
        const criticalPrefix = criticalRoute.split(':')[0];
        const routePrefix = route.split(':')[0];
        return criticalPrefix === routePrefix;
      }
      return route === criticalRoute;
    })
  );
  
  return {
    valid: missingRoutes.length === 0,
    missing: missingRoutes
  };
}

/**
 * Takes a route configuration and extracts all route paths
 * for validation purposes
 * @param routeConfig React Router route configuration object
 * @returns Array of route paths
 */
export function extractRoutePaths(routeConfig: any): string[] {
  // Implementation would depend on your router structure
  // This is a simplistic example
  const paths: string[] = [];
  
  function extractPaths(routes: any, prefix = '') {
    if (!routes) return;
    
    if (Array.isArray(routes)) {
      routes.forEach(route => {
        if (route.path) {
          paths.push(`${prefix}${route.path}`);
        }
        if (route.children) {
          extractPaths(route.children, `${prefix}${route.path}/`);
        }
      });
    } else if (typeof routes === 'object') {
      if (routes.path) {
        paths.push(`${prefix}${routes.path}`);
      }
      if (routes.children) {
        extractPaths(routes.children, `${prefix}${routes.path}/`);
      }
    }
  }
  
  extractPaths(routeConfig);
  return paths;
}
