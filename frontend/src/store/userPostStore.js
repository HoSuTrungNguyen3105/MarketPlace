import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Mock data
const mockCategories = [
  { id: 1, name: "Điện tử" },
  { id: 2, name: "Quần áo" },
  { id: 3, name: "Thực phẩm" },
  { id: 4, name: "Sách vở" },
  { id: 5, name: "Đồ gia dụng" },
];

const mockPosts = [
  {
    _id: "1",
    title: "Mock Post 1",
    description: "This is a mock post",
    category: "Điện tử",
    price: 100,
    images: ["https://via.placeholder.com/150"],
    isApproved: true,
  },
  {
    _id: "2",
    title: "Mock Post 2",
    description: "Another mock post",
    category: "Quần áo",
    price: 50,
    images: ["https://via.placeholder.com/150"],
    isApproved: false,
  },
];

const mockProvinces = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "TP.HCM" },
  { id: 3, name: "Đà Nẵng" },
];

export const usePostStore = create((set, get) => ({
  posts: [], // Lưu danh sách bài đăng
  post: null, // A single post
  provinces: [],
  isCreating: false, // Trạng thái đang tạo bài viết
  createPostError: null,
  createPostSuccess: false,
  errorMessages: [], // Lưu danh sách lỗi
  approvedPosts: [],
  pendingPosts: [],
  categories: [], // Danh sách các category
  isLoading: false, // Trạng thái đang tải
  loading: false, // Trạng thái loading
  error: null, // Lưu thông báo lỗi nếu có

  // Hàm tạo bài đăng (mock)
  createPost: async (formData) => {
    try {
      set({ isCreating: true, errorMessages: [] });
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPost = {
        _id: Date.now().toString(),
        title: formData.get('title') || 'Mock Title',
        description: formData.get('description') || 'Mock Description',
        category: formData.get('category') || 'Mock Category',
        price: formData.get('price') || 0,
        images: ['https://via.placeholder.com/150'],
        isApproved: false,
      };
      set((state) => ({
        posts: [newPost, ...state.posts], // Thêm bài viết mới vào danh sách
        createPostSuccess: true,
      }));
      set({ isCreating: false });
      toast.success("Bài đăng đã được tạo thành công!");
      return newPost; // Trả về bài viết mới tạo
    } catch (error) {
      set({
        isCreating: false,
        createPostSuccess: false,
        errorMessages: ["Lỗi khi tạo bài đăng"],
      });
      toast.error("Đã xảy ra lỗi khi tạo bài đăng");
      return false;
    } finally {
      set({ isCreating: false });
    }
  },

  // Reset createPostSuccess sau khi thông báo đã được xử lý
  resetCreatePostSuccess: () => set({ createPostSuccess: false }),
  // Lấy bài viết theo ID (mock)
  getPostById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundPost = mockPosts.find(p => p._id === id);
      set({ post: foundPost || null });
    } catch (error) {
      set({ error: "Error loading post", post: null });
    } finally {
      set({ isLoading: false });
    }
  },
  getPostByIdwithoutUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundPost = mockPosts.find(p => p._id === id);
      set({ post: foundPost || null });
    } catch (error) {
      set({ error: "Error loading post", post: null });
    } finally {
      set({ isLoading: false });
    }
  },
  // Hàm lấy danh mục từ mock data
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ categories: mockCategories, loading: false });
    } catch (error) {
      set({ error: "Lỗi khi lấy danh mục", loading: false });
    }
  },
  // Phương thức để fetch bài đăng (mock)
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ posts: mockPosts });
    } catch (error) {
      set({ error: "Có lỗi xảy ra khi tải bài đăng" });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPostSearch: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ posts: mockPosts });
    } catch (error) {
      set({ error: "Có lỗi xảy ra khi tải bài đăng" });
    } finally {
      set({ isLoading: false });
    }
  },
  // Delete post (mock)
  deletePost: async (postId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
      }));
      toast.success("Bài đăng đã được xóa!");
    } catch (error) {
      toast.error("Lỗi khi xóa bài đăng");
      throw error;
    }
  },
  fetchPendingPosts: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ pendingPosts: mockPosts.filter(p => !p.isApproved), isLoading: false });
    } catch (error) {
      console.error("Error fetching pending posts:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  // Hàm fetch bài viết đã duyệt (mock)
  fetchApprovedPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ approvedPosts: mockPosts.filter(p => p.isApproved), isLoading: false });
    } catch (error) {
      set({ error: "Error fetching approved posts", isLoading: false });
    }
  },
  toggleApproval: async (postId, currentStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? { ...post, isApproved: !currentStatus } : post
        ),
      }));
      toast.success("Trạng thái đã được cập nhật!");
    } catch (error) {
      console.error("Error updating post approval status:", error);
    }
  },
  // Hàm lấy dữ liệu tỉnh thành từ mock data
  fetchProvinces: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ provinces: mockProvinces, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Hàm lấy tên tỉnh thành theo ID
  getProvinceNameById: (id) => {
    return (
      get().provinces.find((p) => p.id === id)?.name || "Không có địa điểm"
    );
  },
  // Hàm báo cáo bài viết (mock)
  reportPost: async (postId, userId) => {
    set({ isLoading: true, error: null });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
      toast.success("Báo cáo thành công!");
    } catch (error) {
      set({
        isLoading: false,
        error: "Có lỗi xảy ra khi báo cáo.",
      });
      toast.error("Có lỗi xảy ra khi báo cáo.");
    }
  },

  // Action to update the post (mock)
  updatePost: async (updatedPost) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        ),
        post: updatedPost,
        isLoading: false,
      }));
      toast.success("Bài viết đã được cập nhật thành công!");
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error("Có lỗi xảy ra khi cập nhật bài viết.");
    }
  },
  fetchPostSearch: async () => {
    set({ isLoading: true, error: null }); // Bắt đầu tải, đặt error về null
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ posts: mockPosts });
    } catch (error) {
      console.error("Error:", error);
      set({ error: "Có lỗi xảy ra khi tải bài đăng" }); // Lưu lỗi
    } finally {
      set({ isLoading: false }); // Kết thúc quá trình tải
    }
  },
  // Delete post (mock)
  deletePost: async (postId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
      }));
      toast.success("Bài đăng đã được xóa!");
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },
  fetchPendingPosts: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ pendingPosts: mockPosts.filter(p => !p.isApproved), isLoading: false });
    } catch (error) {
      console.error("Error fetching pending posts:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  // Hàm fetch bài viết đã duyệt (mock)
  fetchApprovedPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ approvedPosts: mockPosts.filter(p => p.isApproved), isLoading: false });
    } catch (error) {
      console.error("Error fetching approved posts:", error);
      set({ error: "Error fetching approved posts", isLoading: false });
    }
  },
  toggleApproval: async (postId, currentStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? { ...post, isApproved: !currentStatus } : post
        ),
      }));
      toast.success("Trạng thái đã được cập nhật!");
    } catch (error) {
      console.error("Error updating post approval status:", error);
    }
  },
  // Hàm lấy dữ liệu tỉnh thành từ mock data
  fetchProvinces: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ provinces: mockProvinces, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Hàm lấy tên tỉnh thành theo ID
  getProvinceNameById: (id) => {
    return (
      get().provinces.find((p) => p.id === id)?.name || "Không có địa điểm"
    );
  },
  // Hàm báo cáo bài viết (mock)
  reportPost: async (postId, userId) => {
    set({ isLoading: true, error: null });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
      toast.success("Báo cáo thành công!");
    } catch (error) {
      set({
        isLoading: false,
        error: "Có lỗi xảy ra khi báo cáo.",
      });
      toast.error("Có lỗi xảy ra khi báo cáo.");
    }
  },

  // Action to update the post (mock)
  updatePost: async (updatedPost) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        ),
        post: updatedPost,
        isLoading: false,
      }));
      toast.success("Bài viết đã được cập nhật thành công!");
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error("Có lỗi xảy ra khi cập nhật bài viết.");
    }
  },
}));
