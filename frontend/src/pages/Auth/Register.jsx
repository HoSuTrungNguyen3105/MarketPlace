import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import { Check, Eye, EyeOff, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { useUserStore } from "../../store/useUserStore";
import { usePostStore } from "../../store/userPostStore";

const Register = () => {
  return (
    <div className="Auth">
      <div className="a-left">
        <div className="Webname">
          <h1>TL SOSICAL</h1>
          <h6>Mạng xã hội tìm đồ bị thất lạc toàn quốc</h6>
        </div>
      </div>
      <Auth />
    </div>
  );
};

function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { provinces, isLoading, error, fetchProvinces } = usePostStore(); // Thêm cities vào

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "", // Đảm bảo bạn có trường phone
    firstname: "",
    lastname: "",
    role: "buyer",
    location: {
      provinceId: "",
      city: "",
      address: "",
    },
  });

  const { signup, verifyEmail, isSigningUp, isVerifying, registerError } =
    useAuthStore();
  useEffect(() => {
    // Gọi fetchProvinces khi component mount
    fetchProvinces();
  }, [fetchProvinces]);
  // Regex checks for each requirement
  const lengthCheck = formData.password.length >= 6;
  const letterCheck = /[A-Za-z]/.test(formData.password);
  const specialCheck =
    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ||
    /\d/.test(formData.password);

  const getPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength++; // Đủ độ dài tối thiểu
    if (password.length >= 9) strength++; // Độ dài trên 9 ký tự
    if (password.length >= 12) strength++; // Độ dài trên 12 ký tự
    if (/[A-Za-z]/.test(password)) strength++; // Có chữ cái
    if (/\d/.test(password)) strength++; // Có số
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++; // Có ký tự đặc biệt
    if (strength <= 0) return "";

    if (strength <= 2) return "Rất yếu";
    if (strength <= 3) return "Yếu";
    if (strength <= 4) return "Trung bình";
    if (strength <= 5) return "Mạnh";
    return "Cực mạnh";
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };
  const [districts, setDistricts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signup(formData); // Gọi signup với formData
      if (result) {
        setIsVerificationStep(true); // Chuyển sang bước xác thực
        toast.success("Vui lòng kiểm tra email để lấy mã xác thực!");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleProvinceChange = (e) => {
    const selectedProvinceId = e.target.value;
    const selectedProvince = provinces.find(
      (province) => province.id.toString() === selectedProvinceId
    );

    setFormData({
      ...formData,
      location: {
        ...formData.location,
        provinceId: selectedProvinceId,
        city: "", // Reset city when province changes
      },
    });

    setDistricts(selectedProvince ? selectedProvince.districts : []);
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim())
      return toast.error("Mã xác thực không được để trống");
    const result = await verifyEmail(formData.email, verificationCode);
    if (result) {
      toast.success("Xác thực thành công! Vui lòng đăng nhập.");
      setIsVerificationStep(false);
    }
  };

  return (
    <div className="a-right">
      {!isVerificationStep ? (
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h3 style={{ fontSize: "20px" }}>Đăng Ký</h3>

          {/* Username */}
          <div>
            <input
              type="text"
              className="infoInput"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="text"
              className="infoInput"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <select
              className="infoInput"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              className="infoInput"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* First and Last Name */}
          <div>
            <input
              type="text"
              placeholder="First Name"
              className="infoInput"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="infoInput"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />
          </div>

          {/* Password input field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="infoInput"
              placeholder="••••••••"
              value={formData.password}
              onChange={handlePasswordChange}
            />
          </div>
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye className="size-5 text-base-content/40" />
            ) : (
              <EyeOff className="size-5 text-base-content/40" />
            )}
          </button>
          <div>
            {/* Province selection */}
            <div>
              <label htmlFor="province">Tỉnh/Thành phố</label>
              <select
                id="province"
                value={formData.location.provinceId}
                onChange={handleProvinceChange}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city">Quận/Huyện</label>
              <select
                id="city"
                value={formData.location.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value },
                  })
                }
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value },
                  })
                }
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="button infoButton"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Tạo Tài Khoản"
            )}
          </button>

          {/* Link to Sign In */}
          <div className="text-center">
            <p className="text-base-content/60" style={{ fontSize: "15px" }}>
              Đã có tài khoản?{" "}
              <Link
                to="/sign-in"
                className="link link-primary"
                style={{ color: "blue" }}
              >
                Đăng Nhập
              </Link>
            </p>
          </div>

          {/* Password strength criteria (Now below submit button) */}
          <div className="mt-2">
            <ul className="list-none">
              {/* Length Requirement */}
              <li
                className={`${
                  lengthCheck ? "text-green-500" : "text-red-500"
                } text-sm flex items-center gap-1`}
              >
                {lengthCheck && <Check size={16} />}
                <span>Ít nhất 6 ký tự</span>
              </li>

              {/* Letter Requirement */}
              <li
                className={`${
                  letterCheck ? "text-green-500" : "text-red-500"
                } text-sm flex items-center gap-1`}
              >
                {letterCheck && <Check size={16} />}
                <span>Chứa ít nhất một chữ cái</span>
              </li>

              <li
                className={`${
                  specialCheck ? "text-green-500" : "text-red-500"
                } text-sm flex items-center gap-1`}
              >
                {specialCheck && <Check size={16} />}
                <span>Chứa ít nhất một số hoặc ký tự đặc biệt</span>
              </li>

              {/* Password strength indicator */}
              <div className="mt-2 text-sm font-medium">
                Đánh giá mật khẩu:{" "}
                <span
                  className={`${
                    getPasswordStrength(formData.password) === "Cực mạnh"
                      ? "text-green-500"
                      : getPasswordStrength(formData.password) === "Mạnh"
                      ? "text-lime-500"
                      : getPasswordStrength(formData.password) === "Trung bình"
                      ? "text-yellow-500"
                      : getPasswordStrength(formData.password) === "Yếu"
                      ? "text-orange-800"
                      : getPasswordStrength(formData.password) === "Rất yếu"
                      ? "text-orange-500"
                      : "text-white"
                  }`}
                >
                  {getPasswordStrength(formData.password)}
                </span>
              </div>
            </ul>
          </div>
        </form>
      ) : (
        <form className="infoForm authForm" onSubmit={handleVerification}>
          <h3 style={{ fontSize: "20px" }}>Xác Thực Email</h3>

          {/* Verification Code */}
          <div>
            <input
              type="text"
              className="infoInput"
              placeholder="Mã xác thực"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          {/* Submit Verification */}
          <button
            type="submit"
            className="button infoButton"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader className="size-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Xác Thực"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default Register;
