import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ValuationPage from "./pages/ValuationPage";
import PremiumValuationPage from "./pages/PremiumValuationPage";
import PremiumConditionEvaluationPage from "./pages/PremiumConditionEvaluationPage";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";
import PhotoUploadPage from "./pages/PhotoUploadPage";
import EquipmentSelectionPage from "./pages/EquipmentSelectionPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/valuation",
    element: <ValuationPage />,
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
    element: <AccountPage />,
  },
  {
    path: "/photo",
    element: <PhotoUploadPage />,
  },
  {
    path: "/equipment",
    element: <EquipmentSelectionPage />,
  },
]);
