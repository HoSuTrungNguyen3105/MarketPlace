import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import "./Profile.css";
import { usePostStore } from "../../store/userPostStore";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const { authUser } = useAuthStore();
  const { updateProfileInfo, changeRole, isUpdatingProfile } = useAuthStore();

  const { provinces, fetchProvinces, isLoading } = usePostStore();

  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    firstname: authUser?.firstname || "",
    lastname: authUser?.lastname || "",
    phone: authUser?.phone || "",
    location: authUser?.location || { provinceId: "", cityId: "", address: "" },
    role: authUser?.role || "",
    profilePic: authUser?.profilePic || "",
    lastLogin: authUser?.lastLogin || "",
    isVerified: authUser?.isVerified || false,
    responseRate: authUser?.responseRate || "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString("vi-VN") : "N/A";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location[")) {
      const key = name.slice(9, -1); // Extract key from location[property]
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const selectedProvince = provinces.find(
    (province) => province.id === Number(formData.location.provinceId)
  );
  useEffect(() => {
    if (selectedProvince && selectedProvince.districts.length > 0) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          cityId: selectedProvince.districts[0].id, // Chọn quận/huyện đầu tiên mặc định
        },
      }));
    }
  }, [formData.location.provinceId, selectedProvince]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      await updateProfileInfo(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const handleRoleChange = async (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole) {
      try {
        await changeRole(selectedRole); // Gọi phương thức từ zustand
      } catch (error) {
        console.error("Lỗi khi thay đổi quyền:", error);
      }
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
            <label>Tỉnh/Thành phố:</label>
            <select
              name="location[provinceId]"
              value={formData.location.provinceId}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Chọn tỉnh thành</option>
              {!isLoading &&
                provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
            </select>
          </div>
          {selectedProvince && (
            <div className="Follow">
              <label>Quận/Huyện:</label>
              <select
                name="location[city]"
                value={formData.location.city}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Chọn quận/huyện</option>

                {selectedProvince.districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="Follow">
            <label>Địa chỉ chi tiết:</label>
            <input
              type="text"
              name="location[address]"
              value={formData.location.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="Follow">
            <label>Quyền: {formData.role}</label>
            <select name="role" value={role} onChange={handleRoleChange}>
              <option value="">Quyền</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer(mặc định)</option>
            </select>
            {message && <p>{message}</p>}
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
            <div>
              <Link to="/confirm">Confirm</Link>
            </div>
          </div>
        </form>
        <hr />
      </div>
    </div>
  );
};

export default Profile;
