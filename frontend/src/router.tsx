import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import Homepage from "./pages/Homepage";
import Login from "./components/Form/Login";
import Register from "./components/Form/Register";
import UserProfile from "./pages/UserProfile";
import UserWarehouse from "./pages/UserWarehouse";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashBoard";
import AdminRequest from "./pages/admin/AdminRequest";
import AdminRequestDetail from "./pages/admin/AdminRequestDetail";
import ProtectedRoute from "./components/ProtectRoute/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import RegisterWarehouse from "./pages/warehouse/RegisterWarehouse";
import WarehouseDetail from "./pages/WarehouseDetail";
import Warehouses from "./pages/Warehouses";
import UpdateWarehouse from "./pages/warehouse/UpdateWarehouse";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",

  WAREHOUSES: "/warehouses",
  WAREHOUSE_DETAIL: (id: string) => `/warehouses/${id}`,

  USER_WAREHOUSES: "/user/warehouses",
  USER_WAREHOUSES_ADD: "/user/warehouses/add",
  USER_WAREHOUSES_EDIT: (id: string) => `/user/warehouses/edit/${id}`,

  ADMIN: "/admin",
  ADMIN_REQUESTS: "/admin/request",
  ADMIN_REQUEST_DETAIL: (id: string) => `/admin/requests/${id}`,

  ERROR: "/error",
};

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
            <Homepage />
          </ProtectedRoute>
        ),
      },

      // Auth routes
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.REGISTER, element: <Register /> },

      // User profile
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },

      // Warehouses (public/user)
      {
        path: ROUTES.WAREHOUSES,
        element: (
          <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
            <Warehouses />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.WAREHOUSE_DETAIL(":id"),
        element: (
          <ProtectedRoute allowedRoles={["user", "admin", "owner"]}>
            <WarehouseDetail />
          </ProtectedRoute>
        ),
      },

      // User's own warehouses
      {
        path: ROUTES.USER_WAREHOUSES,
        element: (
          <ProtectedRoute allowedRoles={["admin", "owner"]}>
            <UserWarehouse />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.USER_WAREHOUSES_ADD,
        element: (
          <ProtectedRoute allowedRoles={["admin", "owner"]}>
            <RegisterWarehouse />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.USER_WAREHOUSES_EDIT(":id"),
        element: (
          <ProtectedRoute allowedRoles={["admin", "owner"]}>
            <UpdateWarehouse />
          </ProtectedRoute>
        ),
      },

      // Admin routes
      {
        path: ROUTES.ADMIN,
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.ADMIN_REQUESTS.replace("/admin/", ""), // => "request"
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminRequest />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.ADMIN_REQUEST_DETAIL(":id").replace("/admin/", ""), // => "requests/:id"
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminRequestDetail />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Error
      { path: ROUTES.ERROR, element: <ErrorPage /> },
    ],
  },
]);

export default router;
