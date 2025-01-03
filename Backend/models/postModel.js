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
      type: String, // Danh mục bài đăng
      required: true,
      enum: ["Electronics", "Furniture", "Vehicles", "Real Estate", "Others"], // Các danh mục cố định
    },
    price: {
      type: Number, // Giá sản phẩm/dịch vụ
      required: true,
      validate: {
        validator: function (v) {
          return v > 0; // Giá phải lớn hơn 0
        },
        message: (props) => `${props.value} không phải là giá hợp lệ!`,
      },
    },
    location: {
      type: String, // Địa chỉ hoặc vị trí rao bán
      required: true,
      ref: "User",
    },
    images: {
      type: [String], // Mảng chứa URL các hình ảnh sản phẩm
      default: [],
    },
    contact: {
      type: Number, // Số điện thoại liên hệ
      required: true,
      ref: "User",
    },
    isAvailable: {
      type: Boolean, // Trạng thái còn hàng hay đã bán
      default: true,
    },
    views: {
      type: Number, // Số lượt xem bài viết
      default: 0,
    },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

const PostModel = mongoose.model("MarketplacePost", postSchema);

export default PostModel;
