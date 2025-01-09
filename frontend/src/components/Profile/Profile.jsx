import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import "./Profile.css";

const Profile = () => {
  const { authUser } = useAuthStore();
  const { updateProfileInfo, isUpdatingProfile } = useAuthStore();

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
    responseRate: authUser?.responseRate || "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Định dạng ngày tháng
  const formatDate = (date) =>
    date ? new Date(date).toLocaleString("vi-VN") : "N/A";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfileInfo(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  return (
    <div className="ProfileCard">
      <div className="ProfileImg">
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="relative">
            <img
              src={
                formData.profilePic ||
                "https://pbs.twimg.com/media/Eu9fXIRU4AEafZy?format=jpg&name=4096x4096"
              }
              alt="Profile"
              className="size-32 rounded-full object-cover border-4"
            />
          </div>
          <p className="text-sm text-zinc-400">{formData.email}</p>
        </div>
      </div>

      <div className="ProfileName">
        <div className="user-info flex items-center space-x-2">
          <span>@{formData.username}</span>
          <div className="verified-status flex items-center space-x-1">
            {formData.isVerified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-green-500"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span
              className={`text-sm ${
                formData.isVerified
                  ? "text-green-500 font-medium"
                  : "text-gray-500"
              }`}
            >
              {formData.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </span>
          </div>
        </div>
        {formData.role === "admin" && (
          <p className="text-red-900 font-extrabold mt-2">Admin</p>
        )}
      </div>

      <div className="ProfileDetails">
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="Follow">
            <label>Họ tên:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="Follow">
            <label>Tỉ lệ phản hồi:</label>
            {formData.responseRate}%
          </div>
          <div className="Follow">
            <label>Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="Follow">
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="Follow">
            <label>Quyền:</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="Follow">
            <label>Ngày đăng nhập lần cuối:</label>
            <input
              type="text"
              value={formatDate(formData.lastLogin)}
              disabled
            />
          </div>
          <div className="Follow">
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </button>
            {isEditing && (
              <button type="submit" disabled={isUpdatingProfile}>
                Lưu
              </button>
            )}
          </div>
        </form>
        <hr />
      </div>
    </div>
  );
};

export default Profile;
