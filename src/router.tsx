import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { NotFound } from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { Auth } from "./pages/Auth";
import { Account } from "./pages/Account";
import { Orders } from "./pages/Orders";
import { ValuationPage } from "./pages/ValuationPage";
import { ValuationResultPage } from "./pages/ValuationResultPage";
import { PremiumValuationPage } from "./pages/PremiumValuationPage";
import { CarLookupPage } from "./pages/CarLookupPage";
import PremiumSuccessPage from "./pages/PremiumSuccessPage";

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
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/account/orders",
        element: <Orders />,
      },
      {
        path: "/valuation",
        element: <ValuationPage />,
      },
      {
        path: "/valuation/result/:id",
        element: <ValuationResultPage />,
      },
      {
        path: "/valuation/premium",
        element: <PremiumValuationPage />,
      },
      {
        path: "/car-lookup",
        element: <CarLookupPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/premium-success",
    element: <PremiumSuccessPage />,
  },
]);

export default router;
