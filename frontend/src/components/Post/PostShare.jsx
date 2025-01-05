import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { usePostStore } from "../../store/userPostStore";
import { useAuthStore } from "../../store/useAuthStore";

const PostShare = ({ onPostCreateSuccess }) => {
  const { authUser } = useAuthStore();
  const { createPost, isCreating } = usePostStore();
  const fileInputRef = useRef();

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    userId: authUser?._id || "",
    username: authUser?.username || "",
    title: "",
    description: "",
    contact: authUser?.phone || "", // Tự động lấy từ user
    location: authUser?.location || "", // Tự động lấy từ user
    images: null,
    price: "",
    category: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/post/provinces")
      .then((response) => {
        setProvinces(response.data);
        setLoadingProvinces(false);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setLoadingProvinces(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, images: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const success = await createPost(formData);
      if (success) {
        setFormData({
          userId: authUser?._id || "",
          username: authUser?.username || "",
          title: "",
          description: "",
          contact: authUser?.contact || "",
          location: authUser?.location || "",
          images: null,
          price: "",
          category: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (onPostCreateSuccess) {
          onPostCreateSuccess();
        }
        toast.success("Bài đăng đã được tạo thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      toast.error("Đã xảy ra lỗi khi đăng bài.");
    }
  };

  return (
    <div className="post-share-container">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <h2 className="text-lg font-bold text-gray-800">Tạo bài đăng mới</h2>

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

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Danh mục *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input input-bordered w-full p-3 rounded-md"
            placeholder="Danh mục bài đăng (VD: Bất động sản)"
            required
          />
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
          />
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
