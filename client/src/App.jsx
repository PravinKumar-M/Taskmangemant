import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Auth wrapper
function requireAuth(Component, role) {
  return () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
      return <Navigate to="/login" replace />;
    }

    return <Component />;
  };
}

const router = createBrowserRouter(
  [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    {
      path: "/student-dashboard",
      element: requireAuth(StudentDashboard, "student")(),
    },
    {
      path: "/admin-dashboard",
      element: requireAuth(AdminDashboard, "admin")(),
    },

    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}