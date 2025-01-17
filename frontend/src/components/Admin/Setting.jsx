import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import "./Setting.css";
const Setting = () => {
  const { authUser } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("active"); // Tab hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      if (authUser && authUser._id) {
        const response = await axiosInstance.get(`/post/user/${authUser._id}`);
        setPosts(response.data);
      } else {
        console.error("authUser hoặc authUser._id không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [authUser]);

  // Lọc bài viết theo tab hiện tại
  const filteredPosts = posts.filter((post) => {
    switch (currentTab) {
      case "active":
        return post.status === "active";
      case "archived":
        return post.status === "archived";
      case "rejected":
        return post.moderationStatus === "rejected";
      case "pending":
        return post.moderationStatus === "pending";
      case "draft":
        return post.status === "draft";
      case "hidden":
        return post.status === "hidden";
      default:
        return true;
    }
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="Posts">
      <div className="tabs">
        <div onClick={() => setCurrentTab("active")}>
          ĐANG HIỂN THỊ (
          {posts.filter((post) => post.status === "active").length})
        </div>
        <div onClick={() => setCurrentTab("archived")}>
          HẾT HẠN ({posts.filter((post) => post.status === "archived").length})
        </div>
        <div onClick={() => setCurrentTab("rejected")}>
          BỊ TỪ CHỐI (
          {posts.filter((post) => post.moderationStatus === "rejected").length})
        </div>
        <div onClick={() => setCurrentTab("pending")}>
          CHỜ DUYỆT (
          {posts.filter((post) => post.moderationStatus === "pending").length})
        </div>
        <div onClick={() => setCurrentTab("draft")}>
          TIN NHÁP ({posts.filter((post) => post.status === "draft").length})
        </div>
        <div onClick={() => setCurrentTab("hidden")}>
          ĐÃ ẨN ({posts.filter((post) => post.status === "hidden").length})
        </div>
      </div>
      <div className="posts-container">
        {isLoading ? (
          <p>Đang tải bài viết...</p>
        ) : currentPosts.length === 0 ? (
          <p>Không có bài viết nào phù hợp với tiêu chí lọc.</p>
        ) : (
          currentPosts.map((post, index) => (
            <div key={index} className="post-item">
              <h4>{post.title}</h4>
              <p>{post.isAvailable ? "Còn hàng" : "Hết hàng"}</p>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default Setting;
