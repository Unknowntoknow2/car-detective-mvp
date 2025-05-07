import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PremiumSuccessPage from "./pages/PremiumSuccessPage";
import MyValuationsPage from "./pages/MyValuationsPage";
import ValuationDetailPage from "./pages/ValuationDetailPage";
import PremiumValuationPage from "./pages/PremiumValuationPage";
import DesignSystem from './pages/DesignSystem';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/my-valuations",
        element: <MyValuationsPage />,
      },
      {
        path: "/valuation/:valuationId",
        element: <ValuationDetailPage />,
      },
      {
        path: "/valuation/:valuationId/premium",
        element: <PremiumValuationPage />,
      },
    ],
  },
  {
    path: "/premium-success",
    element: <PremiumSuccessPage />,
  },
  {
    path: "/design-system",
    element: <DesignSystem />
  }
]);

export default router;
