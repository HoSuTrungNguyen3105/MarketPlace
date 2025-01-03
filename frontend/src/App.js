import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navigation/Navbar";
import Sidebar from "./components/Navigation/Sidebar";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import useCheckUserStatus from "./lib/check";
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { checkStatus } = useCheckUserStatus();

  // Kiểm tra trạng thái bị chặn sau khi đã xác thực
  useEffect(() => {
    if (authUser) {
      checkStatus(); // Kiểm tra tài khoản bị chặn
    }
  }, [authUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Hiển thị loader khi đang kiểm tra xác thực
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {/* Navbar ở trên cùng */}
      <header>
        <Navbar />
      </header>

      <div className="flex flex-1">
        {/* Sidebar cố định bên trái */}
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-7">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
