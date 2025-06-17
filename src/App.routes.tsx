
import React from "react";
import { RouteObject } from "react-router-dom";

// ✅ Import the correct components
import EnhancedHomePage from "@/components/home/EnhancedHomePage";
import AboutPage from "@/pages/AboutPage";
import VinLookupPage from "@/pages/VinLookupPage";
import AuthPage from "@/pages/AuthPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
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

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <EnhancedHomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "vin-lookup",
        element: <VinLookupPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
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
