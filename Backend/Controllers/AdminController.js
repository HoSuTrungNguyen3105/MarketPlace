import UserModel from "../models/userModel";

export const getAllUsers = async (req, res) => {
  try {
    // Tìm tất cả người dùng không phải admin
    let users = await UserModel.find({ role: "buyer" });
    // Loại bỏ trường `password` khỏi kết quả trả về
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users); // Trả về danh sách người dùng
  } catch (error) {
    res.status(500).json(error); // Trả về lỗi nếu có
  }
};
export const getAllSeller = async (req, res) => {
  try {
    // Tìm tất cả người dùng không phải admin
    let users = await UserModel.find({ role: "seller" });
    // Loại bỏ trường `password` khỏi kết quả trả về
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users); // Trả về danh sách người dùng
  } catch (error) {
    res.status(500).json(error); // Trả về lỗi nếu có
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ req.params

    // Tìm kiếm người dùng trong cơ sở dữ liệu, ẩn mật khẩu
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    res.status(200).json(user); // Trả về thông tin người dùng
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};

export const allchatUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await messageModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Kiểm tra quyền truy cập (Chỉ admin mới có thể block/unblock)
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to block users" });
    }

    // Đảo trạng thái block
    user.isBlocked = !user.isBlocked;
    await user.save();

    // Trả về thông báo và dữ liệu mới sau khi cập nhật
    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    // Ghi lại lỗi và trả về thông báo lỗi
    console.error("Error updating user block status:", error);
    res.status(500).json({
      message: "Error updating user block status",
      error: error.message,
    });
  }
};
export const getAllMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find()
      .populate("senderId", "username") // Lấy thông tin người gửi
      .populate("receiverId", "username"); // Lấy thông tin người nhận
    console.log(messages.length); // Kiểm tra số lượng tin nhắn trả về
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Lỗi khi lấy tin nhắn" });
  }
};

export const banUsers = async (req, res) => {
  const { senderId, receiverId } = req.body; // Lấy ID người gửi và người nhận từ body của request

  try {
    // Cập nhật trạng thái người dùng bị ban
    const sender = await UserModel.findById(senderId);
    const receiver = await UserModel.findById(receiverId);

    if (!sender || !receiver) {
      return res
        .status(404)
        .json({ error: "Một trong hai người dùng không tồn tại" });
    }

    // Đánh dấu tài khoản bị ban
    sender.isBlocked = true; // Giả sử bạn có trường `isBanned` trong model
    receiver.isBlocked = true; // Cập nhật cho người nhận

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Cả hai người dùng đã bị ban thành công" });
  } catch (error) {
    console.error("Error banning users:", error);
    res.status(500).json({ error: "Lỗi khi ban người dùng" });
  }
};
// Controller để xóa tin nhắn
export const deleteMessage = async (req, res) => {
  const { id } = req.params; // Lấy ID của tin nhắn từ request params

  try {
    const message = await messageModel.findById(id); // Tìm tin nhắn theo ID

    if (!message) {
      return res.status(404).json({ message: "Không tìm thấy tin nhắn" });
    }

    await message.deleteOne(); // Xóa tin nhắn khỏi cơ sở dữ liệu
    res.status(200).json({ message: "Xóa tin nhắn thành công" });
  } catch (err) {
    console.error("Lỗi xóa tin nhắn:", err);
    res.status(500).json({ message: "Lỗi khi xóa tin nhắn" });
  }
};

export const blockUser = async (req, res) => {
  const { userId } = req.params;

  // Kiểm tra nếu userId tồn tại
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra quyền truy cập (Chỉ admin mới có thể block/unblock)
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to block users" });
    }

    // Đảo trạng thái block
    user.isBlocked = !user.isBlocked;
    await user.save();

    // Trả về thông báo và dữ liệu mới sau khi cập nhật
    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    // Ghi lại lỗi và trả về thông báo lỗi
    console.error("Error updating user block status:", error);
    res.status(500).json({
      message: "Error updating user block status",
      error: error.message,
    });
  }
};
