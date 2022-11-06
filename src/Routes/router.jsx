import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/Shared/MainLayout";

// Auth Pages
import Login from "../components/AuthPages/Login";
import Register from "../components/AuthPages/Register";

// Route handlers
import ErrorPage from "../components/Shared/ErrorPage";
import PrivateRoute from "./PrivateRoute";

// Testing Purpose
import Test from "../components/Shared/Test";

const routerObj = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/test",
        element: (
          <PrivateRoute>
            <Test />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routerObj);

export default router;
