import App from "../App.js";
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Home from "../pages/home/Home.jsx";
import SearchPage from "../components/Another/SearchPage.jsx";
import Profile from "../components/Profile/Profile.jsx";
import Posts from "../components/Post/Posts.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import PostShare from "../components/Post/PostShare.jsx";
import CategorySelection from "../components/Post/CategorySelection.jsx";
import ForgetPw from "../pages/Auth/ForgetPw.jsx";
import ResetPw from "../pages/Auth/ResetPw.jsx";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout.jsx";
import PostDetail from "../components/Post/PostDetail.jsx";
import UProfile from "../components/Profile/UProfile.jsx";
import FullSizeChat from "../pages/Chat/FullSizeChat.jsx";
import Transaction from "../components/Transaction/Transaction.jsx";
import Post from "../components/Admin/Post.jsx";
import User from "../components/Admin/User.jsx";
import Setting from "../components/Admin/Setting.jsx";
import Confirm from "../components/Admin/Confirm.jsx";

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
        path: "/input/create-post",
        element: (
          <PrivateRoute>
            <PostShare />
          </PrivateRoute>
        ),
      },
      {
        path: "/transactions",
        element: (
          <PrivateRoute>
            <Transaction />
          </PrivateRoute>
        ),
      },
      {
        path: "/confirm",
        element: <Confirm />,
      },
      {
        path: "/post",
        element: (
          <PrivateRoute>
            <Posts />
          </PrivateRoute>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <PrivateRoute>
            <PostDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "/user/:userId",
        element: (
          <PrivateRoute>
            <UProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/create-post",
        element: <CategorySelection />,
      },
      {
        path: "/forget-password",
        element: <ForgetPw />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPw />,
      },
      {
        path: "/settings",
        element: <Setting />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "posts",
        element: <Post />,
      },
      {
        path: "users",
        element: <User />,
      },
    ],
  },
]);

export default router;
