<<<<<<< HEAD
=======
import ROUTE_SNAPSHOT from "./ROUTE_SNAPSHOT.json";
import { extractRoutePaths } from "../route-validation";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

/**
 * Validates the integrity of application routes
 */
<<<<<<< HEAD
export const enforceRouteIntegrity = (route: string): boolean => {
  // Validate route format
  if (!route || typeof route !== 'string') {
    console.error('Invalid route format:', route);
    return false;
=======
export function validateRoutesAgainstSnapshot(routes: any): {
  valid: boolean;
  missing: string[];
} {
  const currentRoutePaths = extractRoutePaths(routes);

  // Check if all critical routes from the snapshot exist
  const missingRoutes = ROUTE_SNAPSHOT.filter(
    (criticalRoute) =>
      !currentRoutePaths.some((route) => {
        // Handle parameterized routes by checking prefix up to ':'
        if (criticalRoute.includes(":") && route.includes(":")) {
          const criticalPrefix = criticalRoute.split(":")[0];
          const routePrefix = route.split(":")[0];
          return criticalPrefix === routePrefix;
        }
        return route === criticalRoute;
      }),
  );

  return {
    valid: missingRoutes.length === 0,
    missing: missingRoutes,
  };
}

/**
 * Validates routes and throws an error if any critical routes are missing
 * @param routes Array of route objects or route configuration
 */
export function enforceRouteIntegrity(routes: any): void {
  const result = validateRoutesAgainstSnapshot(routes);

  if (!result.valid) {
    const errorMessage = `CRITICAL ROUTES MISSING: ${
      result.missing.join(", ")
    }`;
    console.error(errorMessage);
    throw new Error(errorMessage);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }

  // Basic route integrity checks
  if (route.includes('..')) {
    console.error('Potential path traversal attack detected:', route);
    return false;
  }

  // Check for malicious injection attempts
  const suspiciousPatterns = [
    'javascript:',
    'data:',
    '<script',
    'onclick=',
    'onerror='
  ];

  for (const pattern of suspiciousPatterns) {
    if (route.toLowerCase().includes(pattern)) {
      console.error('Suspicious pattern detected in route:', route);
      return false;
    }
  }

  return true;
};

/**
 * Route validation system
 */
export const validateRouteAccess = (
  route: string,
  userRole?: string | null
): boolean => {
  // Check route integrity first
  if (!enforceRouteIntegrity(route)) {
    return false;
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/premium',
    '/valuation'
  ];

  // Admin-only routes
  const adminRoutes = [
    '/admin',
    '/manage'
  ];

  // Check admin routes
  for (const adminRoute of adminRoutes) {
    if (route.startsWith(adminRoute) && userRole !== 'admin') {
      console.warn('Unauthorized access attempt to admin route:', route);
      return false;
    }
  }

  // Check protected routes
  for (const protectedRoute of protectedRoutes) {
    if (route.startsWith(protectedRoute) && !userRole) {
      console.warn('Unauthorized access attempt to protected route:', route);
      return false;
    }
  }

  return true;
};

export default {
  enforceRouteIntegrity,
  validateRouteAccess
};
