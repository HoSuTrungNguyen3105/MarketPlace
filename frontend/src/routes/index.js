import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App.js";
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Profile from "../components/Profile/Profile.jsx";
import Home from "../pages/Home/Home.jsx"; // Import Home nếu chưa có
import { useAuthStore } from "../store/useAuthStore"; // Import store
import SearchPage from "../components/Main/SearchPage.jsx";
import Posts from "../components/Post/Posts.jsx";

// Tạo PrivateRoute cho các trang yêu cầu đăng nhập
const PrivateRoute = ({ children }) => {
  const { authUser } = useAuthStore();
  return authUser ? children : <Navigate to="/login" />;
};

// Tạo PublicRoute cho các trang không yêu cầu đăng nhập
const PublicRoute = ({ children }) => {
  const { authUser } = useAuthStore();
  return !authUser ? children : <Navigate to="/" />;
};

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/post",
        element: (
          <PrivateRoute>
            <Posts />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
