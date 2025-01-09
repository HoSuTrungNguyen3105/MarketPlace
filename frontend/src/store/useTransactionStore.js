import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useTransactionStore = create((set) => ({
  transactionId: null, // Lưu `id` giao dịch
  message: "", // Thông báo giao dịch
  isLoading: false, // Trạng thái đang tải
  isSubmitting: false, // Trạng thái đang gửi form

  // Hàm kiểm tra giao dịch
  checkTransaction: async ({ postId, buyerId, sellerId }) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/transaction/check?postId=${postId}&buyerId=${buyerId}&sellerId=${sellerId}`
      );
      set({
        transactionId: response.data.id || null,
        message: response.data.message,
      });
    } catch (error) {
      console.error("Error checking transaction:", error);
      set({ message: "Lỗi khi kiểm tra giao dịch." });
    } finally {
      set({ isLoading: false });
    }
  },
  // Hàm tạo giao dịch
  createTransaction: async (formData) => {
    set({ isSubmitting: true, message: "" });
    try {
      await axiosInstance.post("/transaction", formData);
      set({
        message: "Giao dịch đã được tạo thành công!",
        transactionExists: true,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      set({ message: "Lỗi khi tạo giao dịch. Vui lòng thử lại." });
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
