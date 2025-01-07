import React, { useEffect, useRef, useState } from "react";
import { usePostStore } from "../../store/userPostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";

const PostShare = ({ onPostCreateSuccess }) => {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const {
    createPost,
    isCreating,
    categories,
    fetchCategories,
    isLoading,
    error: categoryError,
  } = usePostStore();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const selectedCategory = location.state?.category || {};
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    userId: authUser?._id || "",
    username: authUser?.username || "",
    title: "",
    description: "",
    contact: authUser?.phone || "", // Tự động lấy từ user
    location: authUser?.location || "", // Tự động lấy từ user
    images: [], // Chuyển từ chuỗi sang mảng
    price: "",
    category: selectedCategory.id || "",
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: [...prevFormData.images, ...images], // Lưu tất cả ảnh đã chọn
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting..."); // Thêm dòng này để kiểm tra
    setError("");
    try {
      // Gọi API để tạo bài đăng
      const success = await createPost({ ...formData });

      // Kiểm tra xem API có trả về true không
      if (success) {
        setFormData({
          userId: authUser?._id || "",
          username: authUser?.username || "",
          title: "",
          description: "",
          contact: authUser?.contact || "",
          location: authUser?.location || "",
          images: [], // Chuyển từ chuỗi sang mảng
          price: "",
          category: "",
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        if (onPostCreateSuccess) {
          onPostCreateSuccess(); // Callback sau khi tạo bài thành công
        }
        navigate("/post");
      } else {
        console.log("Đã xảy ra lỗi khi đăng bài.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
    }
  };

  return (
    <div className="post-share-container">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl mx-auto"
        encType="multipart/form-data"
      >
        <h2 className="text-lg font-bold text-gray-800">Tạo bài đăng mới</h2>
        {selectedCategory.name && (
          <p className="text-sm text-gray-600">
            Bạn đang tạo bài đăng trong danh mục:{" "}
            <strong>{selectedCategory.name}</strong>
          </p>
        )}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Tiêu đề *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full p-3 rounded-md"
            placeholder="Nhập tiêu đề bài đăng"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Mô tả *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full p-3 rounded-md"
            placeholder="Viết mô tả..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Giá *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input input-bordered w-full p-3 rounded-md"
            placeholder="Nhập giá (VNĐ)"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Liên lạc *
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="input input-bordered w-full p-3 rounded-md"
            placeholder="Số điện thoại hoặc email"
            readOnly
          />
        </div>

        {/* Danh mục */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Danh mục *
          </label>
          {selectedCategory.name ? (
            <p className="p-3 rounded-md bg-gray-100 text-gray-700">
              {selectedCategory.name}
            </p>
          ) : isLoading ? (
            <p>Đang tải danh mục...</p>
          ) : categoryError ? (
            <p className="text-red-500">{categoryError}</p>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered w-full p-3 rounded-md"
              required
            >
              {categories &&
              Array.isArray(categories) &&
              categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="">Không có danh mục nào</option>
              )}
            </select>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Địa điểm *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input input-bordered w-full p-3 rounded-md"
            placeholder="Địa chỉ hoặc khu vực"
            disabled
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Chọn ảnh *
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="input input-bordered w-full p-3 rounded-md"
            multiple // Cho phép chọn nhiều ảnh
          />
          <div className="mt-2">
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`selected-image-${index}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`btn w-full p-3 rounded-md ${
            isCreating
              ? "btn-disabled loading"
              : "btn-primary hover:bg-blue-600"
          }`}
          disabled={isCreating}
        >
          {isCreating ? "Đang tạo bài..." : "Đăng bài"}
        </button>
      </form>
    </div>
  );
};

export default PostShare;
