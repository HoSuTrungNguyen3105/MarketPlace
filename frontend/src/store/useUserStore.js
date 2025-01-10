import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const useUserStore = create((set, get) => ({
  following: {},
  userData: null, // User profile data
  loading: true, // Loading state
  error: null, // Error state
  products: [], // User products
  productsLoading: true, // Products loading state
  productsError: null, // Error for products
  setUserData: (data) => set({ userData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setProducts: (products) => set({ products }),
  setProductsLoading: (loading) => set({ productsLoading: loading }),
  setProductsError: (error) => set({ productsError: error }),

  // Fetch user data
  fetchUserData: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/user/profile/${userId}`);
      set({ userData: response.data });
    } catch (error) {
      set({ error: "Không thể tải thông tin người dùng." });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch user products
  fetchUserProducts: async (userId) => {
    set({ productsLoading: true, productsError: null });
    try {
      const response = await axiosInstance.get(`/post/user/${userId}`);
      set({ products: response.data });
    } catch (error) {
      set({ productsError: "Không thể tải sản phẩm của người dùng." });
    } finally {
      set({ productsLoading: false });
    }
  },

  fetchFollowingStatus: async (currentUserId, targetUserId) => {
    if (get().following[targetUserId] !== undefined) {
      return get().following[targetUserId];
    }
    if (!currentUserId || !targetUserId) {
      console.error("Missing parameters: currentUserId or targetUserId");
      return;
    }
    try {
      const res = await axiosInstance.get(
        `/user/${targetUserId}/is-following`,
        {
          params: { currentUserId: currentUserId }, // Đảm bảo `currentUserId` được truyền
        }
      );

      const isFollowing = res.data.isFollowing; // API trả về trạng thái
      set((state) => ({
        following: { ...state.following, [targetUserId]: isFollowing },
      }));

      return isFollowing;
    } catch (error) {
      console.error("Failed to fetch follow status:", error);
      return false; // Nếu lỗi, mặc định là không theo dõi
    }
  },
  setFollowing: (targetUserId, isFollowing) => {
    set((state) => ({
      following: { ...state.following, [targetUserId]: isFollowing },
    }));
  },
  followUser: async (currentUserId, targetUserId) => {
    try {
      const res = await axiosInstance.put(`/user/${targetUserId}/follow`, {
        _id: currentUserId,
      });
      set((state) => ({
        following: { ...state.following, [targetUserId]: true },
      }));
      toast.success(res.data.message || "Followed successfully!");
    } catch (error) {
      console.error("Failed to follow user:", error);

      // Lấy thông báo lỗi từ API, tránh rendering toàn bộ đối tượng lỗi
      const errorMessage =
        error.res?.data?.message || "Failed to follow the user.";
      toast.error(errorMessage); // Hiển thị thông báo lỗi chính xác
    }
  },

  // Function unfollowUser trong Zustand store
  unfollowUser: async (currentUserId, targetUserId) => {
    try {
      const res = await axiosInstance.put(`/user/${targetUserId}/unfollow`, {
        _id: currentUserId,
      });
      set((state) => ({
        following: { ...state.following, [targetUserId]: false },
      }));
      toast.success(res.data.message || "Unfollowed successfully!");
    } catch (error) {
      console.error("Failed to unfollow user:", error);

      // Lấy thông báo lỗi từ API, tránh rendering toàn bộ đối tượng lỗi
      const errorMessage =
        error.res?.data?.message || "Failed to unfollow the user.";
      toast.error(errorMessage); // Hiển thị thông báo lỗi chính xác
    }
  },
}));
