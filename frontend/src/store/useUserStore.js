import { axiosInstance } from "../lib/axios";

// Phương thức xóa tin nhắn
deleteMessage: async (messageId) => {
  try {
    const response = await axiosInstance.delete(`/admin/message/${messageId}`); // Gọi API xóa tin nhắn
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
};
