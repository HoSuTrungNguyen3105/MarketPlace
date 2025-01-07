import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js"; // Đảm bảo đã cấu hình Cloudinary
import fs from "fs";

export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      location,
      contact,
      userId,
      images,
    } = req.body;

    // Kiểm tra người dùng
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Người dùng không tồn tại", field: "userId" });
    }

    // Kiểm tra các trường bắt buộc
    if (!title?.trim()) {
      return res
        .status(400)
        .json({ message: "Tiêu đề là bắt buộc", field: "title" });
    }

    if (!price || price <= 0) {
      return res
        .status(400)
        .json({ message: "Giá phải lớn hơn 0", field: "price" });
    }

    // Kiểm tra danh mục
    const cate = Number(category);
    const allowedCategories = Array.from({ length: 20 }, (_, i) => i + 1);
    if (isNaN(cate) || !allowedCategories.includes(cate)) {
      return res
        .status(400)
        .json({ message: "Danh mục không hợp lệ", field: "category" });
    }

    // Kiểm tra và xử lý upload ảnh
    // const uploadedImages = [];
    // console.log("req.body:", req.body); // Kiểm tra dữ liệu body
    // console.log("req.files:", req.files); // Kiểm tra dữ liệu files
    // if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    //   return res.status(400).json({
    //     message: "Cần có ít nhất một hình ảnh",
    //     field: "images",
    //   });
    // }

    // for (const file of req.files) {
    //   try {
    //     // Tải lên Cloudinary
    //     const uploadResponse = await cloudinary.uploader.upload(file.path, {
    //       resource_type: "image",
    //       folder: "posts",
    //     });
    //     uploadedImages.push(uploadResponse.secure_url);

    //     // Xóa file tạm sau khi tải thành công
    //     fs.unlinkSync(file.path);
    //   } catch (uploadError) {
    //     console.error("Lỗi khi tải lên ảnh:", uploadError);
    //     return res.status(500).json({
    //       message: "Lỗi khi tải lên hình ảnh",
    //       error: uploadError.message,
    //     });
    //   }
    // }
    // Upload ảnh lên Cloudinary
    const imageUrls = await handleImageUpload(images); // Upload ảnh và nhận URL

    // Tạo bài đăng mới
    const newPost = new PostModel({
      title,
      description,
      category: cate,
      price,
      location,
      contact,
      images: imageUrls, // Lưu mảng các URL ảnh
      userId,
    });

    await newPost.save();

    return res.status(201).json({
      message: "Bài đăng đã được tạo thành công",
      post: newPost,
    });
  } catch (error) {
    console.error("Lỗi khi tạo bài đăng:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi tạo bài đăng",
      error: error.message,
    });
  }
};
const handleImageUpload = async (images) => {
  const imageUrls = [];

  for (let i = 0; i < images.length; i++) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(images[i], {
        resource_type: "auto", // Tự động nhận dạng loại tệp
      });
      imageUrls.push(uploadResponse.secure_url); // Lưu URL của ảnh vào mảng
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      throw new Error("Có lỗi xảy ra khi upload ảnh");
    }
  }

  return imageUrls;
};
// API để lấy danh sách danh mục
export const getCategories = async (req, res) => {
  try {
    // Mảng danh mục (có thể lấy từ cơ sở dữ liệu hoặc lưu cứng)
    const categories = [
      { id: 1, name: "Đồ điện tử" },
      { id: 2, name: "Dụng cụ trong nhà" },
      { id: 3, name: "Thời trang" },
      { id: 4, name: "Đồ ăn, thực phẩm" },
      { id: 5, name: "Đồ dùng văn phòng" },
      { id: 6, name: "Thú cưng" },
      { id: 7, name: "Thiết bị chơi Game, đồ sưu tầm" },
      { id: 8, name: "Đồ thể thao" },
      { id: 9, name: "Đồ dùng cá nhân" },
      { id: 10, name: "Du lịch" },
    ];
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return res.status(500).json({ message: "Lỗi khi lấy danh mục" });
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
export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("userId", "username _id") // Trả cả username và _id từ UserModel
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.json({
      status: "Success",
      data: posts, // Trả về danh sách bài đăng với thông tin báo cáo
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts" });
  }
};
export const provinces = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "Hồ Chí Minh" },
  { id: 3, name: "Đà Nẵng" },
  { id: 4, name: "Cần Thơ" },
  { id: 5, name: "Hải Phòng" },
  { id: 6, name: "Bình Dương" },
  { id: 7, name: "An Giang" },
  { id: 8, name: "Bắc Giang" },
  { id: 9, name: "Bắc Kạn" },
  { id: 10, name: "Bến Tre" },
  { id: 11, name: "Bình Định" },
  { id: 12, name: "Bình Phước" },
  { id: 13, name: "Bình Thuận" },
  { id: 14, name: "Cà Mau" },
  { id: 15, name: "Cao Bằng" },
  { id: 16, name: "Đắk Lắk" },
  { id: 17, name: "Đắk Nông" },
  { id: 18, name: "Điện Biên" },
  { id: 19, name: "Đồng Nai" },
  { id: 20, name: "Đồng Tháp" },
  { id: 21, name: "Gia Lai" },
  { id: 22, name: "Hà Giang" },
  { id: 23, name: "Hà Nam" },
  { id: 24, name: "Hà Tĩnh" },
  { id: 25, name: "Hải Dương" },
  { id: 26, name: "Hòa Bình" },
  { id: 27, name: "Hưng Yên" },
  { id: 28, name: "Khánh Hòa" },
  { id: 29, name: "Kiên Giang" },
  { id: 30, name: "Kon Tum" },
  { id: 31, name: "Lai Châu" },
  { id: 32, name: "Lâm Đồng" },
  { id: 33, name: "Lạng Sơn" },
  { id: 34, name: "Lào Cai" },
  { id: 35, name: "Long An" },
  { id: 36, name: "Nam Định" },
  { id: 37, name: "Nghệ An" },
  { id: 38, name: "Ninh Bình" },
  { id: 39, name: "Ninh Thuận" },
  { id: 40, name: "Phú Thọ" },
  { id: 41, name: "Phú Yên" },
  { id: 42, name: "Quảng Bình" },
  { id: 43, name: "Quảng Nam" },
  { id: 44, name: "Quảng Ngãi" },
  { id: 45, name: "Quảng Ninh" },
  { id: 46, name: "Sóc Trăng" },
  { id: 47, name: "Sơn La" },
  { id: 48, name: "Tây Ninh" },
  { id: 49, name: "Thái Bình" },
  { id: 50, name: "Thái Nguyên" },
  { id: 51, name: "Thanh Hóa" },
  { id: 52, name: "Thừa Thiên-Huế" },
  { id: 53, name: "Tiền Giang" },
  { id: 54, name: "Trà Vinh" },
  { id: 55, name: "Tuyên Quang" },
  { id: 56, name: "Vĩnh Long" },
  { id: 57, name: "Vĩnh Phúc" },
  { id: 58, name: "Yên Bái" },
];

export const reportPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại." });
    }

    // Kiểm tra xem người dùng đã báo cáo bài viết này chưa
    const alreadyReported = post.reports.some(
      (report) => report.reportedBy.toString() === userId
    );
    if (alreadyReported) {
      return res.status(400).json({ message: "Bạn đã báo cáo bài viết này." });
    }

    // Thêm báo cáo vào mảng reports
    post.reports.push({ reportedBy: userId });
    await post.save();

    res.status(200).json({ message: "Bài viết đã được báo cáo thành công." });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra khi báo cáo bài viết." });
    console.error(error); // Ghi log lỗi
  }
};
export const getPostbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.views += 1;
    await post.save();

    return res.json({
      status: "Success",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};
