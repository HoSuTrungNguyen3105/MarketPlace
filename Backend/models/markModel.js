import mongoose from "mongoose";

const bookmarkSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MarketplacePost",
    }, // Lưu ID bài viết
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, // Lưu ID người dùng
  },
  {
    timestamps: true, // Thêm trường thời gian tạo và cập nhật
  }
);

const MarkModel = mongoose.model("Bookmark", bookmarkSchema);

export default MarkModel;
