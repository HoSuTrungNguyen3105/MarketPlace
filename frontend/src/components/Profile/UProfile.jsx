import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios"; // Cấu hình axios
import "./Profile.css";
import { usePostStore } from "../../store/userPostStore";

const UProfile = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const navigate = useNavigate(); // Điều hướng trang
  const [userData, setUserData] = useState(null); // Thông tin người dùng
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Trạng thái lỗi
  const { posts } = usePostStore();

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/user/profile/${userId}`);
        setUserData(response.data);
      } catch (error) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  // Xử lý nút quay lại
  const handleGoBack = () => navigate(-1);

  // Chặn hoặc bỏ chặn người dùng
  const handleBlockUser = async () => {
    try {
      const response = await axiosInstance.put(`/admin/block/${userId}`);
      if (response.status === 200) {
        setUserData((prev) => ({
          ...prev,
          isBlocked: !prev.isBlocked, // Cập nhật trạng thái chặn
        }));
      }
    } catch (err) {
      console.error("Lỗi khi chặn người dùng:", err);
    }
  };

  // Hiển thị trạng thái loading và lỗi
  if (loading) return <p>Đang tải thông tin người dùng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Hồ sơ người dùng */}
      <div className="profile-page max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Banner */}
        <div className="banner w-full h-60">
          <img
            src={userData.profilePic || "/logo512.png"}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thông tin người dùng */}
        <div className="header p-6">
          <div className="flex items-center justify-between">
            {/* Tên và thông tin cơ bản */}
            <div>
              <h1 className="text-2xl font-bold">
                {userData.username || "TOTO MOBILE"}
              </h1>
              <p className="text-lg text-gray-600">
                {userData.location || "Địa chỉ không khả dụng"}
              </p>
              <p className="text-sm text-gray-600">Email: {userData.email}</p>
              <p className="text-sm text-gray-600">
                Điện thoại: {userData.phone || "Không khả dụng"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">&#9733; 4.7</span>
                <span className="text-sm text-gray-500">(115 đánh giá)</span>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4">
              <button
                onClick={handleBlockUser}
                className={`btn btn-sm ${
                  userData.isBlocked ? "bg-red-500" : "bg-green-500"
                } text-white`}
              >
                {userData.isBlocked ? "Bỏ Chặn" : "Chặn"}
              </button>
              <button
                onClick={handleGoBack}
                className="btn btn-outline btn-sm text-gray-600 hover:bg-gray-100"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="p-6">
          <h2 className="text-xl font-bold">Thông tin chi tiết</h2>
          <p>Vai trò: {userData.role}</p>
          <p>Người theo dõi: {userData.followers.length}</p>
          <p>Đang theo dõi: {userData.following.length}</p>
          <p>Số sản phẩm đã bán: {userData.soldItems}</p>
          <p>Số sản phẩm đang hoạt động: {userData.activeListings}</p>
          <p>Tỉ lệ phản hồi: {userData.responseRate}%</p>
          <p>Đã xác minh: {userData.isVerified ? "Có" : "Không"}</p>
        </div>

        {/* Thanh điều hướng */}
        <div className="tabs border-t border-b py-2 flex justify-around text-center">
          <button className="tab text-blue-600 font-semibold">CỬA HÀNG</button>
          <button className="tab text-gray-500 hover:text-blue-600">
            HOẠT ĐỘNG
          </button>
          <button className="tab text-gray-500 hover:text-blue-600">
            ĐÁNH GIÁ
          </button>
        </div>

        {/* Nội dung chính */}
        <div className="p-6">
          <p>
            Nội dung thông tin của người dùng sẽ hiển thị tại đây. Bạn có thể
            thêm các phần phụ như lịch sử hoạt động hoặc đánh giá.
          </p>
        </div>
      </div>

      {/* Hiển thị sản phẩm của người dùng */}
      <UserProducts userId={userId} />
    </div>
  );
};

const UserProducts = ({ userId }) => {
  const [products, setProducts] = useState([]); // Lưu trữ danh sách sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi nếu có

  // Fetch sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/post/user/${userId}`);
        setProducts(response.data); // Lưu sản phẩm từ API
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm của người dùng:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (products.length === 0) return <p>Không có sản phẩm nào để hiển thị.</p>;

  return (
    <div className="profile-page max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-4">
      <h2 className="text-xl font-bold p-4">Sản phẩm của người dùng</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <Link to={`/post/${product._id}?userId=${userId}`}>
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow hover:shadow-md"
            >
              <img
                src={product.images || "/default-product.jpg"}
                alt={product.name}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UProfile;
