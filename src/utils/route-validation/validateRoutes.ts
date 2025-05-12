
import ROUTE_SNAPSHOT from "./ROUTE_SNAPSHOT.json";
import { extractRoutePaths } from "../route-validation";

/**
 * Validates that all critical routes defined in the snapshot exist in the current routes
 * @param routes Array of route objects or route configuration
 * @returns Object with validation status and missing routes if any
 */
export function validateRoutesAgainstSnapshot(routes: any): { 
  valid: boolean; 
  missing: string[];
} {
  const currentRoutePaths = extractRoutePaths(routes);
  
  // Check if all critical routes from the snapshot exist
  const missingRoutes = ROUTE_SNAPSHOT.filter(
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

/**
 * Validates routes and throws an error if any critical routes are missing
 * @param routes Array of route objects or route configuration
 */
export function enforceRouteIntegrity(routes: any): void {
  const result = validateRoutesAgainstSnapshot(routes);
  
  if (!result.valid) {
    const errorMessage = `CRITICAL ROUTES MISSING: ${result.missing.join(', ')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}
