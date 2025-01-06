import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../../store/userPostStore";

const CategorySelection = () => {
  const { categories, loading, error, fetchCategories } = usePostStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi fetchCategories nếu chưa có dữ liệu
    if (categories.length === 0 && !loading) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories, loading]);

  const handleCategoryClick = (category) => {
    if (!category?.id) return; // Kiểm tra nếu category không có id
    navigate(`/input/create-post`, { state: { category } }); // Chuyển trang với dữ liệu category
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {categories.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category)}
                className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <span className="text-gray-800 font-medium">
                  {category.name}
                </span>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Không có danh mục nào
        </div>
      )}
    </div>
  );
};

export default CategorySelection;
