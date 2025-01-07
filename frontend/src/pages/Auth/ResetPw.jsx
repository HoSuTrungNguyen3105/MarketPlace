import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";

const ResetPw = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { password, setPassword } = useAuthStore();

  // Kiểm tra các tiêu chí của mật khẩu
  const lengthCheck = password.length >= 6;
  const letterCheck = /[a-zA-Z]/.test(password);
  const specialCheck = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  // Đánh giá độ mạnh mật khẩu
  const getPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (lengthCheck && letterCheck && specialCheck) return "Cũng mạnh";
    if (lengthCheck && (letterCheck || specialCheck)) return "Hơi mạnh 1 xí";
    if (password.length >= 4) return "Thường thôi";
    return password.length > 0 ? "Yếu quá" : "Rất yếu";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/auth/reset-password-from-forget/" + token, { password })
      .then((response) => {
        if (response.data.status) {
          toast.success("Bạn đã đổi pass thành công!");
          navigate("/login");
        } else {
          toast.error(response.data.message || "Có lỗi xảy ra!");
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra!";
        toast.error(errorMessage);
      });
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <div className="form-control">
          <h3>Nhập mật khẩu mới</h3>
          <div className="form-control">
            <input
              className="infoInput"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-reset">
            Submit
          </button>
        </div>

        {/* Hiển thị tiêu chí mật khẩu */}
        <div className="mt-2">
          <ul className="list-none">
            <li
              className={`${
                lengthCheck ? "text-green-500" : "text-red-500"
              } text-sm flex items-center gap-1`}
            >
              {lengthCheck && <span>✔</span>}
              <span>Ít nhất 6 ký tự</span>
            </li>
            <li
              className={`${
                letterCheck ? "text-green-500" : "text-red-500"
              } text-sm flex items-center gap-1`}
            >
              {letterCheck && <span>✔</span>}
              <span>Chứa ít nhất một chữ cái</span>
            </li>
            <li
              className={`${
                specialCheck ? "text-green-500" : "text-red-500"
              } text-sm flex items-center gap-1`}
            >
              {specialCheck && <span>✔</span>}
              <span>Chứa ít nhất một số hoặc ký tự đặc biệt</span>
            </li>
          </ul>

          {/* Đánh giá độ mạnh mật khẩu */}
          <div className="mt-2 text-sm font-medium">
            Đánh giá mật khẩu:{" "}
            <span
              className={`${
                getPasswordStrength(password) === "Cũng mạnh"
                  ? "text-green-500"
                  : getPasswordStrength(password) === "Hơi mạnh 1 xí"
                  ? "text-lime-500"
                  : getPasswordStrength(password) === "Thường thôi"
                  ? "text-yellow-500"
                  : getPasswordStrength(password) === "Yếu quá"
                  ? "text-orange-800"
                  : "text-orange-500"
              }`}
            >
              {getPasswordStrength(password)}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPw;
