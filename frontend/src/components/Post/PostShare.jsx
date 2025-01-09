import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [dynamicFields, setDynamicFields] = useState({});
  const [customFieldsSchema, setCustomFieldsSchema] = useState([]);
  const [formData, setFormData] = useState({
    userId: authUser?._id || "",
    username: authUser?.username || "",
    title: "",
    description: "",
    contact: authUser?.phone || "",
    location: authUser?.location || "",
    images: [],
    price: "",
    category: selectedCategory.id || "",
    condition: "used",
  });

  useEffect(() => {
    fetchCategories();
    if (selectedCategory.id) {
      setCustomFieldsSchema(selectedCategory.customFields || []);
    }
  }, [fetchCategories, selectedCategory]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "category") {
        const selected = categories.find((cat) => cat.id === value);
        setCustomFieldsSchema(selected?.customFields || []);
        setDynamicFields({});
      }
    },
    [categories]
  );

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    ).then((images) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...images],
      }));
    });
  }, []);

  const handleDynamicFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    setDynamicFields((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { ...formData, customFields: dynamicFields };
    setError("");
    try {
      const success = await createPost(postData);
      if (success) {
        setFormData({
          userId: authUser?._id || "",
          username: authUser?.username || "",
          title: "",
          description: "",
          contact: authUser?.contact || "",
          location: authUser?.location || "",
          images: [],
          price: "",
          category: "",
          condition: "used",
        });
        setDynamicFields({});
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (onPostCreateSuccess) {
          onPostCreateSuccess();
        }
        navigate("/post");
      } else {
        setError("Đã xảy ra lỗi khi đăng bài.");
      }
    } catch (error) {
      setError("Lỗi khi tạo bài viết: " + error.message);
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
        {error && <p className="text-red-500">{error}</p>}
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
              <option value="">Chọn danh mục</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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
            multiple
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`selected-image-${index}`}
                className="w-20 h-20 object-cover rounded-md"
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Tình trạng
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="select select-bordered w-full p-3 rounded-md"
          >
            <option value="used">Đã qua sử dụng</option>
            <option value="new">Mới</option>
          </select>
        </div>

        {customFieldsSchema.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800">
              Thông tin bổ sung
            </h3>
            {customFieldsSchema.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={dynamicFields[field.name] || ""}
                  onChange={handleDynamicFieldChange}
                  placeholder={field.placeholder || "Nhập thông tin..."}
                  className="input input-bordered w-full p-3 rounded-md"
                />
              </div>
            ))}
          </div>
        )}

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
