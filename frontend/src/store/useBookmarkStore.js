// stores/bookmarkStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useBookmarkStore = create((set) => ({
  bookmarks: [], // Danh sách bookmark
  isBookmarking: false, // Trạng thái khi thêm hoặc xóa bookmark
  errorMessage: "", // Thông báo lỗi nếu có

  // Thêm bài viết vào danh sách bookmark
  addBookmark: async (postId, userId) => {
    set({ isBookmarking: true });
    try {
      const response = await axiosInstance.post("/post/bookmark", {
        postId,
        userId,
      });
      if (response.data.message === "Đánh dấu thành công") {
        set((state) => ({
          bookmarks: [...state.bookmarks, postId],
          isBookmarking: false,
        }));
        toast.success("Đánh dấu thành công");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
      set({ errorMessage, isBookmarking: false });
      toast.error(errorMessage);
    }
  },

  // Xóa bài viết khỏi danh sách bookmark
  removeBookmark: async (postId, userId) => {
    set({ isBookmarking: true });
    try {
      const response = await axiosInstance.delete(`/post/bookmark/${postId}`, {
        data: { userId },
      });
      if (response.data.message === "Đã xóa khỏi danh sách đánh dấu") {
        set((state) => ({
          bookmarks: state.bookmarks.filter((id) => id !== postId),
          isBookmarking: false,
        }));
        toast.success("Đã xóa khỏi danh sách đánh dấu");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
      set({ errorMessage, isBookmarking: false });
      toast.error(errorMessage);
    }
  },

  // Kiểm tra trạng thái bookmark của bài viết
  checkBookmarkStatus: async (postId, userId) => {
    set({ isBookmarking: true });
    try {
      const response = await axiosInstance.get(`/post/bookmark/${postId}`, {
        params: { userId },
      });
      set({ isBookmarking: false });
      return response.data.isBookmarked;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
      set({ errorMessage, isBookmarking: false });
      toast.error(errorMessage);
    }
  },
}));

export default useBookmarkStore;
