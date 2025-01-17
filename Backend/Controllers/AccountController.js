import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";

// Get a User by ID
export const getUserProfile = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  try {
    const user = await UserModel.findById(userId);

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails); // Trả về thông tin người dùng (không bao gồm mật khẩu)
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json("User not found");
      }

      // Thực hiện xóa
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Forbidden: Access denied");
  }
};

export const followUser = async (req, res) => {
  const userId = req.params.id; // Lấy userId từ URL
  const { _id } = req.body; // Lấy ID người theo dõi từ body

  if (!userId || !_id) {
    return res.status(400).json({ message: "Missing user IDs" });
  }

  try {
    const followUser = await UserModel.findOne({ _id: userId }); // Tìm user bằng userId
    const followingUser = await UserModel.findOne({ _id }); // Tìm user bằng _id (ID người theo dõi)

    if (!followUser) {
      return res
        .status(404)
        .json({ message: "Người dùng không tìm thấy hoặc đã xóa tài khoản" });
    }

    if (!followingUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    if (!followUser.followers.includes(_id)) {
      // Cập nhật danh sách followers và following
      await followUser.updateOne({ $push: { followers: _id } });
      await followingUser.updateOne({ $push: { following: userId } });
      res.status(200).json("Theo dõi thành công!");
    } else {
      res.status(403).json("Bạn đã theo dõi người này");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller bỏ theo dõi user
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    return res.status(403).json({ message: "Bạn ko thể unfollow chính mình" });
  }

  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(_id);

    if (followUser.followers.includes(_id)) {
      await followUser.updateOne({ $pull: { followers: _id } });
      await followingUser.updateOne({ $pull: { following: id } });

      return res.status(200).json({ message: "Bỏ theo dõi thành công!" });
    } else {
      return res.status(403).json({ message: "Bạn chưa theo dõi người này!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to unfollow the user!" });
  }
};
// Kiểm tra trạng thái follow giữa hai người dùng
export const fetchFollowingStatus = async (req, res) => {
  const { currentUserId } = req.query; // Lấy currentUserId từ query
  const { targetUserId } = req.params; // Lấy targetUserId từ params

  try {
    // Kiểm tra nếu cả hai userId được truyền
    if (!currentUserId || !targetUserId) {
      return res.status(400).send({ message: "Missing parameters" });
    }

    // Tìm user được theo dõi
    const targetUser = await UserModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found." });
    }

    // Kiểm tra currentUserId có trong danh sách followers không
    const isFollowing = targetUser.followers.includes(currentUserId);

    return res.status(200).json({ isFollowing }); // Trả về trạng thái follow
  } catch (error) {
    console.error("Error fetching follow status:", error);
    return res
      .status(500)
      .json({ message: "Lỗi user đã xóa tài khoản hoặc không kết nối được." });
  }
};
export const searchUser = async (req, res) => {
  try {
    const query = req.query.q || "";
    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { firstname: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm kiếm người dùng" });
  }
};
export const searchPost = async (req, res) => {
  try {
    const query = req.query.q || "";
    const posts = await PostModel.find({
      desc: { $regex: query, $options: "i" },
    }).populate("userId", "username profilePic");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm kiếm bài đăng" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cập nhật thông tin người dùng (không bao gồm role)
export const updateUserInfo = async (req, res) => {
  try {
    const { username, firstname, lastname, email, phone, location } = req.body;

    const userId = req.user._id;

    const locationUpdate = location
      ? {
          provinceId: location.provinceId,
          city: location.city,
          address: location.address,
        }
      : {};

    const updateData = {
      username,
      firstname,
      lastname,
      email,
      phone,
      location: locationUpdate,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Lỗi trong quá trình cập nhật thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
};

// Yêu cầu thay đổi role (dành cho buyer)
export const requestRoleChange = async (req, res) => {
  try {
    const { requestedRole } = req.body;
    const userId = req.user._id;

    if (req.user.role !== "buyer") {
      return res
        .status(403)
        .json({ message: "Chỉ buyer mới có thể yêu cầu thay đổi role" });
    }

    const newRequest = new UserModel({
      userId,
      currentRole: req.user.role,
      requestedRole,
      status: "pending",
    });

    await newRequest.save();

    res.status(200).json({
      message: "Yêu cầu thay đổi role đã được gửi và đang chờ admin duyệt",
    });
  } catch (error) {
    console.error("Lỗi trong quá trình yêu cầu thay đổi role:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
};
export const changeRole = async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: "Vui lòng chọn quyền hợp lệ." });
  }
  // Giả sử bạn kiểm tra logic quyền ở đây
  try {
    if (role === "admin") {
      // Xử lý logic nếu người dùng muốn làm admin
      // Ví dụ: Gửi yêu cầu chờ admin xác nhận
      return res.status(200).json({
        message: "Đã tạo liên kết, chờ admin xác nhận quyền.",
      });
    } else {
      // Thay đổi quyền ngay lập tức cho seller hoặc buyer
      // Ví dụ: Ghi quyền vào database
      return res.status(200).json({
        message: `Đã thay đổi quyền thành ${role}`,
      });
    }
  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi server." });
  }
};
// Admin duyệt yêu cầu thay đổi role
export const approveRoleChange = async (req, res) => {
  try {
    const { requestId, approved } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Chỉ admin mới có quyền duyệt yêu cầu thay đổi role",
      });
    }

    const request = await UserModel.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy yêu cầu thay đổi role" });
    }

    if (approved) {
      await UserModel.findByIdAndUpdate(request.userId, {
        role: request.requestedRole,
      });
      request.status = "approved";
    } else {
      request.status = "rejected";
    }

    await request.save();

    res.status(200).json({
      message: `Yêu cầu thay đổi role đã được ${
        approved ? "chấp nhận" : "từ chối"
      }`,
    });
  } catch (error) {
    console.error("Lỗi trong quá trình duyệt yêu cầu thay đổi role:", error);
    res.status(500).json({ message: "Lỗi server nội bộ" });
  }
};

// Middleware kiểm tra quyền truy cập admin
export const checkAdminAccess = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Không có quyền truy cập" });
  }
};
export const getUserById = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  try {
    const user = await UserModel.findById(userId);

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails); // Trả về thông tin người dùng (không bao gồm mật khẩu)
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  // Kiểm tra xem mật khẩu cũ và mới đã được nhập đầy đủ chưa
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  // Kiểm tra độ dài của mật khẩu mới
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }

    // Băm mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();

    // Trả về thông báo thành công
    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi thay đổi mật khẩu" });
  }
};
