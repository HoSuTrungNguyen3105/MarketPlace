import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePostStore } from "../../store/userPostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import { motion } from "framer-motion";

const PostShare = ({ onPostCreateSuccess }) => {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const {
    createPost,
    isCreating,
    categories,
    fetchCategories,
    error: categoryError,
  } = usePostStore();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const selectedCategory = location.state?.category || {};
  const [error, setError] = useState(null);
  const [customFields, setCustomFields] = useState({});
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
    customFields: {},
  });

  useEffect(() => {
    fetchCategories();
    if (selectedCategory.id) {
      setCustomFields(selectedCategory.customFields || {});
    }
  }, [fetchCategories, selectedCategory]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name.startsWith("custom_")) {
        setFormData((prev) => ({
          ...prev,
          customFields: {
            ...prev.customFields,
            [name.replace("custom_", "")]: value,
          },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      if (name === "category") {
        const selected = categories.find((cat) => cat.id === value);
        setCustomFields(selected?.customFields || {});
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { ...formData };
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
          customFields: {},
        });
        setCustomFields({});
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
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
        encType="multipart/form-data"
      >
        <h2 className="text-4xl font-extrabold mb-6">✨ Tạo bài đăng mới</h2>
        {selectedCategory.name && (
          <p className="text-sm font-medium bg-white bg-opacity-10 p-3 rounded-lg">
            Bạn đang tạo bài đăng trong danh mục:{" "}
            <strong>{selectedCategory.name}</strong>
          </p>
        )}
        {/* {error && (
          <p className="text-red-300 bg-red-900 bg-opacity-50 p-4 rounded-lg">
            {error}
          </p>
        )} */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold">Tiêu đề *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-4 bg-white bg-opacity-20 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 placeholder-gray-300"
            placeholder="Nhập tiêu đề bài đăng"
            required
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold">Mô tả *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 bg-white bg-opacity-20 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 placeholder-gray-300 min-h-[120px]"
            placeholder="Viết mô tả..."
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-semibold">Giá *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-4 bg-white bg-opacity-20  rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 placeholder-gray-300"
              placeholder="Nhập giá (VNĐ)"
              required
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold">Tình trạng</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-4 bg-white bg-opacity-20  rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300"
            >
              <option value="used">Đã qua sử dụng</option>
              <option value="new">Mới</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold">Chọn ảnh *</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="w-full p-4 bg-white bg-opacity-20  rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            multiple
          />
          <div className="mt-4 flex flex-wrap gap-4">
            {formData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`selected-image-${index}`}
                className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-white"
              />
            ))}
          </div>
        </div>

        {selectedCategory.customFields &&
          Object.keys(selectedCategory.customFields).length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Thông tin bổ sung</h3>
              {Object.entries(selectedCategory.customFields).map(
                ([key, field]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-semibold">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={`custom_${field.name}`}
                      value={formData.customFields[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full p-4 bg-white bg-opacity-20  rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 placeholder-gray-300"
                    />
                  </div>
                )
              )}
            </div>
          )}

        {formData.category && (
          <ProductDetails
            category={formData.category}
            dynamicFields={formData.customFields}
            onFieldChange={(e) =>
              handleChange({
                target: {
                  name: `custom_${e.target.name}`,
                  value: e.target.value,
                },
              })
            }
          />
        )}

        <button
          type="submit"
          className={`w-full p-4 rounded-lg font-bold text-lg transition-all ${
            isCreating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
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
