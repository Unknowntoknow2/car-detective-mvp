
/**
 * Extracts route paths from the route configuration
 * 
 * @param routes Array of route objects or route configuration
 * @returns Array of route paths
 */
export function extractRoutePaths(routes: any): string[] {
  const paths: string[] = [];
  
  if (Array.isArray(routes)) {
    routes.forEach(route => {
      if (typeof route === 'object' && route !== null) {
        // Check if route is a direct route object with path
        if ('path' in route && typeof route.path === 'string') {
          paths.push(route.path);
        }
        
        // Recursively check children or nested routes
        if ('children' in route && Array.isArray(route.children)) {
          const childPaths = extractRoutePaths(route.children);
          paths.push(...childPaths);
        }
      }
    });
  }
  
  return paths;
}

/**
 * Validates that all critical routes exist in the application
 * 
 * @param routes Array of route objects or route configuration
 * @param criticalRoutes Array of critical route paths that must exist
 * @returns Object with validation status and missing routes if any
 */
export function validateCriticalRoutes(routes: any, criticalRoutes: string[]): { 
  valid: boolean; 
  missing: string[];
} {
  const currentRoutePaths = extractRoutePaths(routes);
  
  // Check if all critical routes exist
  const missingRoutes = criticalRoutes.filter(
    criticalRoute => !currentRoutePaths.some(route => {
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
