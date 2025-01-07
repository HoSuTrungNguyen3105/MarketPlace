import React, { useState, useEffect } from "react";
import { usePostStore } from "../../store/userPostStore";
import { useAuthStore } from "../../store/useAuthStore";
import Post from "./Post";
import Loader from "../Another/Loader";
import { axiosInstance } from "../../lib/axios.js";

const Posts = () => {
  const { posts, isLoading, fetchPosts, createPostSuccess } = usePostStore();
  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  // Hàm xử lý khi bấm vào bài viết
  const handleViewPost = async (postId) => {
    try {
      // Gửi request để tăng số lượt xem
      const response = await axiosInstance.get(`/post/detail/${postId}`);

      // Truyền lại dữ liệu bài đăng đã được cập nhật vào post mới
      // Có thể cập nhật lại trạng thái bài viết nếu cần
      // Ví dụ, bạn có thể cập nhật lại danh sách bài viết
      fetchPosts(); // Cập nhật lại danh sách bài viết sau khi lượt xem được tăng lên
    } catch (error) {
      console.error("Lỗi khi cập nhật lượt xem:", error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Lấy danh sách bài viết khi component mount
  }, [fetchPosts]);

  useEffect(() => {
    if (createPostSuccess) {
      // Cuộn lên đầu trang khi có bài viết mới
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [createPostSuccess]); // Chỉ chạy khi createPostSuccess thay đổi

  return (
    <div className="Posts">
      {isLoading && <Loader />}
      <div>
        {posts.map((item, i) => (
          <Post
            key={i}
            data={item}
            currentUserId={currentUserId}
            authUserId={authUser._id}
            handleViewPost={handleViewPost} // Truyền hàm handleViewPost vào Post
          />
        ))}
        {posts.length === 0 && !isLoading && (
          <p>Hiện không có bài đăng nào được phê duyệt.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
