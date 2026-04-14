import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:5000";

// Mock user data
const mockUser = {
  _id: "mock-user-id",
  username: "mockuser",
  email: "mock@example.com",
  role: "admin", // Có thể đổi thành "admin" hoặc "seller" để test
  phone: "0123456789",
  location: "Hà Nội",
  avatar: "https://via.placeholder.com/150",
};

export const useAuthStore = create((set, get) => ({
  authUser: null,
  password: "",
  setPassword: (password) => set({ password }),
  setAuthUser: (user) => set({ authUser: user }), // Hàm cập nhật authUser
  isSigningUp: false,
  isLoggingIn: false,
  errorMessage: "",
  resetPasswordSuccess: false,
  setIsLoggingIn: (status) => set({ isLoggingIn: status }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setResetPasswordSuccess: (status) => set({ resetPasswordSuccess: status }),
  registerError: null,
  isUpdatingProfile: false,
  isDeleting: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  users: [], // Danh sách tất cả người dùng
  user: null, // Thông tin người dùng
  setUser: (user) => set({ user }),

  checkAuth: async () => {
    try {
      // Mock: Simulate checking auth
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ authUser: mockUser });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true, registerError: null });
    try {
      // Mock: Simulate signup success
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Đăng ký thành công!");
      return true;
    } catch (error) {
      const errorMessage = "Đã xảy ra lỗi";
      set({ registerError: errorMessage });
      toast.error(errorMessage);
      set({ isSigningUp: false });
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (email, code) => {
    try {
      // Mock: Always verify successfully
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Xác thực email thành công!");
      return true;
    } catch (error) {
      toast.error("Xác thực thất bại");
      return false;
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      // Mock: Simulate login success
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ authUser: mockUser, isLoggingIn: false });
      toast.success("Đăng nhập thành công");
    } catch (error) {
      const errorMessage = "Đã xảy ra lỗi";
      set({ registerError: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  fetchDataByRole: async (role) => {
    // Mock: Return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: "Mock data for role " + role };
  },
  logout: async () => {
    try {
      // Mock: Simulate logout
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ authUser: null });
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error("Lỗi đăng xuất");
    }
  },

  deleteAccount: async () => {
    try {
      set({ isDeleting: true });
      // Mock: Simulate delete
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ authUser: null, isLoggingIn: false });
      toast.success("Tài khoản đã được xóa");
      return true;
    } catch (error) {
      toast.error("Lỗi khi xóa tài khoản");
    } finally {
      set({ isDeleting: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      // Mock: Simulate update
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({ authUser: { ...state.authUser, ...data } }));
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  changeRole: async (role) => {
    set({ isUpdatingProfile: true });
    try {
      // Mock: Simulate role change
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({ authUser: { ...state.authUser, role } }));
      toast.success(`Đã thay đổi quyền thành ${role}`);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi thay đổi quyền!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfileInfo: async (data) => {
    set((state) => ({
      authUser: { ...state.authUser, ...data },
      isUpdatingProfile: true,
      errorMessage: "",
    }));

    try {
      // Mock: Simulate update
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({ authUser: { ...state.authUser, ...data } }));
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      set((state) => ({ authUser: { ...state.authUser, ...data } })); // Rollback nếu lỗi
      toast.error("Lỗi cập nhật");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      set({ authUser: res.data });
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      // Xử lý lỗi: Kiểm tra xem error có response từ server hay không
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Đã xảy ra lỗi khi cập nhật!";
        console.error("Error in updateProfile:", errorMessage);
        toast.error(errorMessage);
      } else {
        // Xử lý lỗi không có response (lỗi mạng hoặc khác)
        console.error("Error in updateProfile:", error.message);
        toast.error("Không thể kết nối với máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      // Đảm bảo tắt trạng thái loading trong mọi trường hợp
      set({ isUpdatingProfile: false });
    }
  },
  changeRole: async (role) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/change-role", { role });
      set({ authUser: res.data }); // Cập nhật người dùng sau khi thay đổi quyền
      toast.success(
        role === "admin"
          ? "Đã tạo liên kết, chờ admin xác nhận quyền."
          : `Đã thay đổi quyền thành ${role}`
      );
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Đã xảy ra lỗi khi thay đổi quyền!";
        console.error("Error in changeRole:", errorMessage);
        toast.error(errorMessage);
      } else {
        console.error("Error in changeRole:", error.message);
        toast.error("Không thể kết nối với máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfileInfo: async (data) => {
    set((state) => ({
      authUser: { ...state.authUser, ...data }, // Cập nhật tạm thời
      isUpdatingProfile: true,
      errorMessage: "",
    }));

    try {
      const response = await axiosInstance.put(
        "/user/update-profile-info",
        data
      );
      set({ authUser: response.data }); // Ghi đè bằng dữ liệu từ server
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      set((state) => ({ authUser: { ...state.authUser, ...data } })); // Rollback nếu lỗi
      // Xử lý lỗi
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    // Mock: Simulate socket connection
    const socket = {
      connected: true,
      disconnect: () => set({ socket: null }),
      on: (event, callback) => {
        if (event === "getOnlineUsers") {
          callback(["mock-user-1", "mock-user-2"]);
        }
      },
    };
    set({ socket: socket });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
