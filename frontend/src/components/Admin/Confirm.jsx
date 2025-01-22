import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";

const Confirm = () => {
  const [password, setPassword] = useState(""); // State để lưu mật khẩu
  const [error, setError] = useState(null); // State để lưu lỗi
  const { authUser, checkAuth } = useAuthStore(); // Lấy thông tin authUser và checkAuth từ store

  useEffect(() => {
    checkAuth(); // Kiểm tra xem người dùng đã đăng nhập chưa khi component được mount
  }, [checkAuth]);
  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // Cập nhật mật khẩu khi người dùng nhập
  };

  const handleConfirm = async () => {
    if (!authUser) {
      setError("Người dùng chưa đăng nhập!");
      return;
    }

    try {
      // Gửi mật khẩu đến API để kiểm tra
      const res = await axiosInstance.post("/auth/check-password", {
        password, // Chỉ gửi mật khẩu người dùng nhập vào
      });

      if (res.status === 200) {
        console.log("Mật khẩu xác thực thành công");
        setError(null); // Xóa lỗi nếu xác thực thành công
      }
    } catch (err) {
      console.error(err);
      setError("Mật khẩu không đúng, vui lòng thử lại!");
    }
  };

  return (
    <div>
      <h3>Xác nhận mật khẩu</h3>
      <input
        type="Đây là mật khẩu của tôi"
        value={authUser.password}
        disabled // Cập nhật state khi nhập
      />
      <input
        type="password"
        placeholder="Nhập mật khẩu hiện tại"
        value={password}
        onChange={handlePasswordChange}
      />
      <button onClick={handleConfirm}>Xác nhận</button>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Hiển thị lỗi nếu có */}
    </div>
  );
};

export default Confirm;
