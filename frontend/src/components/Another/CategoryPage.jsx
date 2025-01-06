import React from "react";
import CategorySelection from "../components/CategorySelection";

const categories = [
  { id: "1", name: "Điện thoại & Máy tính bảng" },
  { id: "2", name: "Điện tử & Điện gia dụng" },
  { id: "3", name: "Phụ kiện & Thiết bị số" },
  { id: "4", name: "Laptop & Máy vi tính" },
  { id: "5", name: "Máy ảnh & Quay phim" },
];

const CategoryPage = () => {
  const handleCategoryClick = (category) => {
    console.log("Danh mục được chọn:", category);
    // Thêm logic của bạn ở đây khi một danh mục được nhấp vào
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chọn danh mục</h1>
      <CategorySelection
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />
    </div>
  );
};

export default CategoryPage;
