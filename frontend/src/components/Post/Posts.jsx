import React, { useEffect, useState } from "react";
import { usePostStore } from "../../store/userPostStore";
import { useAuthStore } from "../../store/useAuthStore";
import Post from "./Post";
import Loader from "../Another/Loader";

const Posts = () => {
  const { posts, isLoading, fetchPosts } = usePostStore();
  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const postsPerPage = 10; // Số sản phẩm mỗi trang

  useEffect(() => {
    fetchPosts(); // Lấy danh sách bài viết khi component mount
  }, [fetchPosts]);

  // Tính toán bài viết hiển thị trên trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Tính tổng số trang
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Tạo danh sách các số trang
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="Posts">
      {isLoading && <Loader />}
      <div className="posts-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentPosts.map((item, i) => (
          <Post
            key={i}
            data={item}
            currentUserId={currentUserId}
            authUserId={authUser._id}
          />
        ))}
        {posts.length === 0 && !isLoading && (
          <p>Hiện không có bài đăng nào được phê duyệt.</p>
        )}
      </div>
      {/* Pagination Container */}
      <div className="pagination-container fixed bottom-0 left-0 w-full bg-white py-4 shadow-md z-50">
        <div className="pagination flex justify-center">
          <button
            className="bg-gray-500 text-white py-2 px-4 mx-2 rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Trang trước
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`py-2 px-4 mx-1 rounded ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          ))}
          <button
            className="bg-blue-500 text-white py-2 px-4 mx-2 rounded"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
