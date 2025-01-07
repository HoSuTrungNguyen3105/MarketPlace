import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navigation/Navbar";
import Sidebar from "./components/Navigation/Sidebar";
import { ToastBar, Toaster, ToastIcon } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import useCheckUserStatus from "./lib/check";
import { Loader } from "lucide-react";
import Chat from "./pages/Chat/Chat";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { checkStatus } = useCheckUserStatus();

  useEffect(() => {
    checkAuth();
    if (authUser) {
      checkStatus();
    }
  }, []); // Chạy chỉ một lần

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <header>
        <Navbar />
      </header>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-7">
          <Outlet />
        </main>
        <Chat />
        <Toaster />
      </div>
    </div>
  );
}

export default App;
