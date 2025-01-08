import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePostStore } from "../../store/userPostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";

const PostShare2 = ({ onPostCreateSuccess }) => {
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: selectedCategory.id || "",
  });

  const [dynamicFields, setDynamicFields] = useState({});
  const [customFieldsSchema, setCustomFieldsSchema] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (selectedCategory.id) {
      // Giả định rằng `selectedCategory.customFields` chứa schema của các trường động
      setCustomFieldsSchema(selectedCategory.customFields || []);
    }
  }, [fetchCategories, selectedCategory]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "category") {
        // Xử lý khi thay đổi danh mục
        const selected = categories.find((cat) => cat.id === value);
        setCustomFieldsSchema(selected?.customFields || []);
        setDynamicFields({}); // Reset các trường động
      }
    },
    [categories]
  );

  const handleDynamicFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    setDynamicFields((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { ...formData, ...dynamicFields };
    setError("");

    try {
      const success = await createPost(postData);
      if (success) {
        setFormData({ title: "", description: "", category: "" });
        setDynamicFields({});
        if (fileInputRef.current) fileInputRef.current.value = "";
        onPostCreateSuccess?.();
        navigate("/post");
      } else {
        console.log("Đã xảy ra lỗi khi đăng bài.");
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
        {selectedCategory.name && (
          <p className="text-sm text-gray-600">
            Bạn đang tạo bài đăng trong danh mục:{" "}
            <strong>{selectedCategory.name}</strong>
          </p>
        )}
        <FormInput
          label="Tiêu đề *"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Nhập tiêu đề bài đăng"
          required
        />
        <FormInput
          label="Mô tả *"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Nhập mô tả bài đăng"
          required
        />
        <CategorySelector
          categories={categories}
          value={formData.category}
          onChange={handleChange}
          isLoading={isLoading}
          error={categoryError}
        />
        {customFieldsSchema.map((field) => (
          <FormInput
            key={field.name}
            label={field.label}
            type={field.type}
            name={field.name}
            value={dynamicFields[field.name] || ""}
            onChange={handleDynamicFieldChange}
            placeholder={field.placeholder}
            required={field.required}
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
