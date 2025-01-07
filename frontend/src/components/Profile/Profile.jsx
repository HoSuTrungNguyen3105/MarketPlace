import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";
import "./Profile.css";
const Profile = () => {
  const { authUser } = useAuthStore(); // Lấy thông tin người dùng từ store
  const { updateProfileInfo, isUpdatingProfile, errorMessage } = useAuthStore(); // Lấy hàm updateProfile và trạng thái từ store zustand

  // State để lưu dữ liệu từ form, bắt đầu từ thông tin người dùng hiện tại
  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    firstname: authUser?.firstname || "",
    lastname: authUser?.lastname || "",
    phone: authUser?.phone || "",
    location: authUser?.location || "",
    role: authUser?.role || "",
    profilePic: authUser?.profilePic || "",
    lastLogin: authUser?.lastLogin || "",
    isVerified: authUser?.isVerified || false,
  });

  // State quản lý chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);

  // Hàm xử lý thay đổi dữ liệu từ các trường input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi updateProfile từ zustand để gửi dữ liệu lên server
      await updateProfileInfo(formData);
      setIsEditing(false); // Đóng chế độ chỉnh sửa sau khi cập nhật thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  return (
    <div className="ProfileCard">
      <div className="ProfileImg">
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="relative">
            {/* Hiển thị ảnh đại diện của người dùng */}
            <img
              src={
                formData.profilePic ||
                "https://pbs.twimg.com/media/Eu9fXIRU4AEafZy?format=jpg&name=4096x4096"
              }
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
            />
          </div>
          <p className="text-sm text-zinc-400">{formData.email}</p>
        </div>
      </div>

      <div className="ProfileName">
        <span>@{formData.username}</span>
        <span style={{ fontSize: "23px" }}></span>

        {/* Hiển thị "Tôi là admin" nếu role là admin */}
        {formData.role === "admin" && (
          <p className="text-red-900 font-extrabold mt-2">Admin</p>
        )}
      </div>

      <div className="ProfileDetails">
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="Follow">
            <span>Họ tên:</span>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              disabled={!isEditing} // Disabled khi không chỉnh sửa
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              disabled={!isEditing} // Disabled khi không chỉnh sửa
            />
          </div>

          <div className="Follow">
            <span>Số điện thoại:</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing} // Disabled khi không chỉnh sửa
            />
          </div>

          <div className="Follow">
            <span>Địa chỉ:</span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!isEditing} // Disabled khi không chỉnh sửa
            />
          </div>

          <div className="Follow">
            <span>Quyền:</span>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!isEditing} // Disabled khi không chỉnh sửa
            />
          </div>

          <div className="Follow">
            <span>Ngày đăng nhập lần cuối:</span>
            <input
              type="text"
              name="lastLogin"
              value={new Date(formData.lastLogin).toLocaleString()}
              disabled
            />
          </div>

          <div className="Follow">
            <span>Đã xác minh:</span>
            <input
              type="checkbox"
              name="isVerified"
              checked={formData.isVerified}
              onChange={(e) =>
                setFormData({ ...formData, isVerified: e.target.checked })
              }
              disabled={!isEditing}
            />
          </div>

          {/* Hiển thị nút "Chỉnh sửa" hoặc "Lưu" */}
          <div className="Follow">
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </button>
            {isEditing && <button type="submit">Lưu</button>}
          </div>
        </form>
        <hr />
      </div>
    </div>
  );
};

export default Profile;
