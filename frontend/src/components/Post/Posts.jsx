import React, { useEffect } from "react";
import { usePostStore } from "../../store/userPostStore";
import { useAuthStore } from "../../store/useAuthStore";
import Post from "./Post";
import Loader from "../Another/Loader";

const Posts = () => {
  const { posts, isLoading, fetchPosts } = usePostStore();
  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  useEffect(() => {
    fetchPosts(); // Lấy danh sách bài viết khi component mount
  }, [fetchPosts]); // Chỉ chạy khi createPostSuccess thay đổi

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
