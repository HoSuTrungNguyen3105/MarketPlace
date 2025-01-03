import PostModel from "../models/postModel";
import UserModel from "../models/userModel";
import cloudinary from "cloudinary"; // Đảm bảo đã cấu hình Cloudinary

export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      location,
      contact,
      images,
      userId,
    } = req.body;

    // Kiểm tra người dùng
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User không tìm thấy", field: "userId" });
    }

    // Kiểm tra tiêu đề bài viết
    if (!title || title.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Tiêu đề bị thiếu", field: "title" });
    }

    // Kiểm tra giá bài viết
    if (!price || price <= 0) {
      return res.status(400).json({
        message: "Giá không hợp lệ. Giá phải lớn hơn 0.",
        field: "price",
      });
    }
    // Kiểm tra danh mục
    const allowedCategories = [
      "Electronics",
      "Furniture",
      "Vehicles",
      "Real Estate",
      "Others",
    ];
    if (!allowedCategories.includes(category)) {
      return res
        .status(400)
        .json({ message: "Danh mục không hợp lệ", field: "category" });
    }

    // Kiểm tra giá
    if (!price || price <= 0) {
      return res
        .status(400)
        .json({ message: "Giá phải lớn hơn 0", field: "price" });
    }

    // Kiểm tra số điện thoại liên hệ
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(contact)) {
      return res
        .status(400)
        .json({ message: "Số điện thoại không hợp lệ", field: "contact" });
    }

    // Upload hình ảnh lên Cloudinary (nếu có)
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: "image",
        });
        uploadedImages.push(uploadResponse.secure_url);
      }
    }

    // Tạo bài viết mới
    const newPost = new PostModel({
      userId,
      title,
      description,
      category,
      price,
      location,
      contact,
      images: uploadedImages,
      isAvailable: true,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    res.status(500).json({
      message: "Lỗi tạo bài viết",
      error: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tìm thấy" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Lỗi lấy bài viết:", error);
    res.status(500).json({ message: "Lỗi lấy bài viết", error: error.message });
  }
};

export const getPostToProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await PostModel.find({ userId });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Lỗi lấy bài viết của người dùng:", error);
    res.status(500).json({
      message: "Lỗi lấy bài viết của người dùng",
      error: error.message,
    });
  }
};
