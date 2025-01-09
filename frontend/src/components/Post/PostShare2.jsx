import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePostStore } from "../../store/userPostStore";
import { useLocation, useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";

const PostShare2 = ({ onPostCreateSuccess }) => {
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
  const [formData, setFormData] = useState({ customFields: {} });
  const [customFieldsSchema, setCustomFieldsSchema] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (selectedCategory.id) {
      setCustomFieldsSchema(selectedCategory.customFields || []);
    }
  }, [fetchCategories, selectedCategory]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleCustomFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      customFields: { ...prev.customFields, [name]: value },
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const success = await createPost(formData);
      if (success) {
        setFormData({ customFields: {} });
        if (fileInputRef.current) fileInputRef.current.value = "";
        onPostCreateSuccess?.();
        navigate("/post");
      }
    } catch (err) {
      console.error("Lỗi khi tạo bài viết:", err);
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
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

        <CategorySelector
          categories={categories}
          value={formData.category || ""}
          onChange={handleInputChange}
          isLoading={!categories.length}
          error={categoryError}
        />

        {customFieldsSchema.map((field) => (
          <FormInput
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            value={formData.customFields[field.name] || ""}
            onChange={handleCustomFieldChange}
          />
        ))}

        <button type="submit" className="btn btn-primary" disabled={isCreating}>
          {isCreating ? "Đang tạo..." : "Tạo bài đăng"}
        </button>
      </form>
    </div>
  );
};

const FormInput = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input {...props} className="input input-bordered w-full p-3 rounded-md" />
  </div>
);

const CategorySelector = ({
  categories,
  value,
  onChange,
  isLoading,
  error,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      Danh mục *
    </label>
    {isLoading ? (
      <p>Đang tải danh mục...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      <select
        name="category"
        value={value}
        onChange={onChange}
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
);

export default PostShare2;
