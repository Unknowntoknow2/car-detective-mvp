
import React from "react";
import { RouteObject } from "react-router-dom";
import { EnhancedHomePage } from "./components/home/EnhancedHomePage";
import AboutPage from "./pages/AboutPage";
import VinLookupPage from "./pages/VinLookupPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ValuationPage from "./pages/ValuationPage";
import PremiumValuationPage from "./pages/PremiumValuationPage";
import ValuationResultPage from "./pages/ValuationResultPage";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import AccountPage from "./pages/AccountPage";
import ServiceHistoryPage from "./pages/ServiceHistoryPage";
import Layout from "./components/layout/Layout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
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
        path: "premium-valuation",
        element: <PremiumValuationPage />,
      },
      {
        path: "valuation/result/:id",
        element: <ValuationResultPage />,
      },
      {
        path: "result",
        element: <ResultPage />,
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
        element: <NotFoundPage />,
      },
    ],
  },
];

export default routes;
