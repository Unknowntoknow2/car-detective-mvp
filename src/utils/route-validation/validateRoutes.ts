// Import statement needs to be updated to not use JSON directly, 
// or tsconfig needs to include resolveJsonModule option

// Replace:
// import routeSnapshot from './ROUTE_SNAPSHOT.json';
// With:
const routeSnapshot = {
  routes: [
    "/",
    "/about",
    "/auth",
    "/contact",
    "/dashboard",
    "/valuation",
    "/premium",
    "/not-found"
  ]
};

export function validateRoutes(currentRoutes: string[]): { valid: boolean; missingRoutes: string[] } {
  const criticalRoutes = routeSnapshot.routes;
  const missingRoutes: string[] = [];
  
  criticalRoutes.forEach((criticalRoute: string) => {
    if (!currentRoutes.includes(criticalRoute)) {
      missingRoutes.push(criticalRoute);
    }
  });
  
  return {
    valid: missingRoutes.length === 0,
    missingRoutes
  };
}
