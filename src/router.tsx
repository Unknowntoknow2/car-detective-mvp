
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import PremiumValuationPage from "./pages/PremiumValuationPage";
import PremiumConditionEvaluationPage from "./pages/PremiumConditionEvaluationPage";
import AuthPage from "./pages/AuthPage";
import EquipmentSelectionPage from "./pages/EquipmentSelectionPage";
import { Loader2 } from "lucide-react";

// Lazy load pages to improve initial load time
const HomePage = lazy(() => import("./pages/Index"));
const ValuationPage = lazy(() => import("./pages/FreeValuationPage"));
const AccountPage = lazy(() => import("./pages/ProfilePage"));
// Fix the PhotoUploadPage import issue
// const PhotoUploadPage = lazy(() => import("./pages/PhotoUploadPage"));

// Loader component for lazy-loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/valuation",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ValuationPage />
      </Suspense>
    ),
  },
  {
    path: "/premium",
    element: <PremiumValuationPage />,
  },
  {
    path: "/premium/condition",
    element: <PremiumConditionEvaluationPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/account",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AccountPage />
      </Suspense>
    ),
  },
  /* Temporarily comment out this route until PhotoUploadPage is implemented
  {
    path: "/photo",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PhotoUploadPage />
      </Suspense>
    ),
  },
  */
  {
    path: "/equipment",
    element: <EquipmentSelectionPage />,
  },
]);
