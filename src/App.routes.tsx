
import React from "react";
import { RouteObject } from "react-router-dom";

// ✅ Import the correct components
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import ValuationPage from "@/pages/valuation/ValuationPage";
import Premium from "@/pages/Premium";
import ValuationResultPage from "@/pages/valuation/result/ValuationResultPage";
import ResultsPage from "@/pages/ResultsPage";
import ProfilePage from "@/pages/ProfilePage";
import AccountPage from "@/pages/AccountPage";
import ServiceHistoryPage from "@/pages/ServiceHistoryPage";
import ManualValuationPage from "@/pages/valuation/manual/ManualValuationPage";
import ValuationFollowUpPage from "@/pages/ValuationFollowUpPage";
import PremiumResultsPage from "@/pages/PremiumResultsPage";
import OffersPage from "@/pages/OffersPage";
import ViewOfferPage from "@/pages/view-offer/ViewOfferPage";
import PlateValuationPage from "@/pages/valuation/plate/PlateValuationPage";
import DealerSignup from "@/pages/DealerSignup";

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "dealer-signup",
        element: <DealerSignup />,
      },
      {
        path: "valuation",
        element: <ValuationPage />,
      },
      {
        path: "valuation/:vin",
        element: <ValuationPage />,
      },
      {
        path: "plate-valuation",
        element: <PlateValuationPage />,
      },
      {
        path: "manual-valuation",
        element: <ManualValuationPage />,
      },
      {
        path: "premium",
        element: <Premium />,
      },
      {
        path: "valuation/result/:id",
        element: <ValuationResultPage />,
      },
      {
        path: "valuation/followup",
        element: <ValuationFollowUpPage />,
      },
      {
        path: "results/:id",
        element: <ResultsPage />,
      },
      {
        path: "premium/results/:id",
        element: <PremiumResultsPage />,
      },
      {
        path: "offers",
        element: <OffersPage />,
      },
      {
        path: "view-offer/:token",
        element: <ViewOfferPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "service-history",
        element: <ServiceHistoryPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
