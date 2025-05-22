
/**
 * Validates the integrity of application routes
 */
export const enforceRouteIntegrity = (route: string): boolean => {
  // Validate route format
  if (!route || typeof route !== 'string') {
    console.error('Invalid route format:', route);
    return false;
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
