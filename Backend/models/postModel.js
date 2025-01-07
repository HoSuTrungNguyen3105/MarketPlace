import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // ID người dùng tạo bài viết
      ref: "User", // Tham chiếu tới model User
      required: true, // Bắt buộc phải có
    },
    title: {
      type: String, // Tiêu đề bài viết
      required: true, // Bắt buộc
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    description: {
      type: String, // Mô tả chi tiết sản phẩm/dịch vụ
      required: true,
    },
    category: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // ID của các danh mục
    },
    price: {
      type: Number, // Giá sản phẩm/dịch vụ
      required: true,
    },
    location: {
      type: String, // Địa chỉ hoặc vị trí rao bán
    },
    images: {
      type: [String], // Mảng chứa URL các hình ảnh sản phẩm
      default: [],
    },

    contact: {
      type: String,
    },
    condition: {
      type: String, // Tình trạng sản phẩm (mới/đã qua sử dụng)
      enum: ["new", "used"],
      default: "used",
    },
    sellerRating: {
      type: Number, // Điểm đánh giá người bán
      default: 0,
      min: 0,
      max: 5,
    },
    paymentMethods: {
      type: [String], // Các phương thức thanh toán được chấp nhận
      enum: ["cash", "bank transfer", "paypal", "credit card"],
      default: ["cash"],
    },
    isAvailable: {
      type: Boolean, // Trạng thái còn hàng hay đã bán
      default: true,
    },
    views: {
      type: Number, // Số lượt xem bài viết
      default: 0,
    },
    reports: {
      type: [
        {
          reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          reportedAt: { type: Date, default: Date.now },
        },
      ],
      default: [], // Thêm giá trị mặc định là mảng rỗng
    },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

const PostModel = mongoose.model("MarketplacePost", postSchema);

export default PostModel;
