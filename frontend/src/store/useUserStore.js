import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const useUserStore = create((set, get) => ({
  following: {},
  ads: [],
  setAds: (ads) => set({ ads }),
  addAd: (ad) => set((state) => ({ ads: [...state.ads, ad] })),
  // Phương thức xóa tin nhắn
  deleteMessage: async (messageId) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/message/${messageId}`
      ); // Gọi API xóa tin nhắn
      if (response.status === 200) {
        // Nếu API trả về thành công, xóa tin nhắn trong state
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        }));
        toast.success("Xóa tin nhắn thành công!");
      }
    } catch (error) {
      console.error("Lỗi xóa tin nhắn:", error);
      toast.error("Có lỗi xảy ra khi xóa tin nhắn");
      throw error; // Ném lỗi để component bắt lỗi
    }
  },

  fetchFollowingStatus: async (currentUserId, targetUserId) => {
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
        error.response?.data?.message || "Failed to follow the user.";
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
        error.response?.data?.message || "Failed to unfollow the user.";
      toast.error(errorMessage); // Hiển thị thông báo lỗi chính xác
    }
  },
}));
