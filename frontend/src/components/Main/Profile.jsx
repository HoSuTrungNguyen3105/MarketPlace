import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  return (
    <div className="ProfileCard">
      <div className="ProfileImg">
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="relative">
            <img
              src={authUser.profilePic || "avatar.jpg"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
            />
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile ? "Uploading..." : ""}
          </p>
        </div>
      </div>
      <div className="ProfileName">
        <span>@{authUser?.username}</span>
        <span style={{ fontSize: "23px" }}>
          {authUser.firstname} {authUser.lastname}
        </span>
        {/* Hiển thị "Tôi là admin" nếu role là admin */}
        {authUser?.role === "admin" && (
          <p className="text-red-900 font-extrabold mt-2">Admin</p>
        )}
      </div>
      <div className="FollowStatus">
        <hr />
        <div>
          {/* Cột Followers */}
          <div className="Follow">
            <span>{authUser.connect?.length || 0}</span>{" "}
            <span>Người theo dõi</span>
          </div>
        </div>
        <hr />
      </div>
      {/* Các liên kết khác */}
      <span>
        <div className="profile-menu">
          <ul>
            <li className="i-profile">
              <Link to="/profile">Trang Cá Nhân</Link>
            </li>
          </ul>
          <ul>
            <li className="i-profile">
              <strong>Provider</strong>: {authUser.firstname}
            </li>
          </ul>
          <ul>
            <button className="i-profile" onClick={handleLogout}>
              Đăng xuất
            </button>
          </ul>
          <ul>
            <li className="i-profile">
              <Link to="/delete-account">Xóa tài khoản</Link>
            </li>
          </ul>
          <ul>
            <li className="i-profile">
              <Link to="/change-password">Đổi mật khẩu</Link>
            </li>
          </ul>
        </div>
      </span>
    </div>
  );
};

export default Profile;
