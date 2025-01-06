import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
  users: [], // Danh sách tất cả người dùng
  user: null, // Thông tin người dùng
  setUser: (user) => set({ user }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
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
      await axiosInstance.post("/auth/register", data);
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
      set({ registerError: errorMessage }); // Lưu thông báo lỗi
      toast.error(errorMessage);
      set({ isSigningUp: false });
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (email, code) => {
    try {
      await axiosInstance.post("/auth/verify-email", {
        email,
        verificationCode: code,
      });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Xác thực thất bại");
      return false;
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data, isLoggingIn: false });
      toast.success("Đăng nhập thành công");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
      set({ registerError: errorMessage }); // Lưu thông báo lỗi
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  fetchDataByRole: async (role) => {
    // Hàm lấy dữ liệu theo vai trò (role)
    const response = await axiosInstance.get(`/auth/data?role=${role}`);
    return response.data;
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteAccount: async () => {
    try {
      set({ isDeleting: true });
      const response = await axiosInstance.delete("/auth/delete"); // Delete API
      set({ authUser: null, isLoggingIn: false }); // Clear Zustand state
      toast.success(response.data.message);
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting your account."
      );
    } finally {
      set({ isDeleting: false });
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
}));
