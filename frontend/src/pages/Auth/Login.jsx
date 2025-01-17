import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  // Truyền isAdminLogin qua props
  return (
    <div className="Login">
      <div className="a-left">
        <div className="a-webname">
          <h1>TL SOSICAL</h1>
        </div>
      </div>
      {/* <Login isAdminLogin={isAdminLogin} /> */}
      <InPut />
    </div>
  );
};

function InPut({ isAuthorityLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, user, fetchDataByRole } = useAuthStore();
  const [error, setError] = useState(""); // Thêm state để lưu lỗi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi khi bắt đầu submit

    try {
      // Gửi yêu cầu đăng nhập với tham số isAdminLogin
      await login({ ...formData, isAuthorityLogin });

      if (user) {
        const expectedRole = isAuthorityLogin ? "admin" : "user"; // Vai trò mong muốn

        if (user.role === expectedRole) {
          // Vai trò khớp
          await fetchDataByRole(user.role); // Lấy dữ liệu theo vai trò
        } else {
          // Vai trò không khớp
          setError("!!! Error");
        }
      }
    } catch (err) {
      // Xử lý lỗi từ server
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="a-right">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3 style={{ fontSize: "20px" }}>
          {isAuthorityLogin ? "Đăng Nhập Admin" : "Đăng Nhập Người Dùng"}
        </h3>
        {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}
        <div>
          <input
            placeholder="you@example.com"
            className="infoInput"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <input
            className="infoInput"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="button infoButton"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>
        <div>
          <p className="text-base-content/60" style={{ fontSize: "12px" }}>
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="link link-primary"
              style={{ color: "blue" }}
            >
              Đăng Ký
            </Link>
          </p>
        </div>

        <div>
          <p className="text-base-content/60" style={{ fontSize: "12px" }}>
            <Link
              to="/forget-password"
              className="link link-primary"
              style={{ color: "blue" }}
            >
              Quên mật khẩu?
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
