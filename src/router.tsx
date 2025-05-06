
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
    ],
  },
  {
    path: "/premium-success",
    element: <PremiumSuccessPage />,
  },
]);

export default router;
