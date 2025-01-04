import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { usePostStore } from "../../store/userPostStore";

const Post = ({ data, currentUserId }) => {
  const { provinces, fetchProvinces, reportPost, deletePost } = usePostStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const navigate = useNavigate();

  const isCurrentUserPost = currentUserId === (data.userId?._id || data.userId);
  const username = data.userId?.username || "Người dùng ẩn danh";

  // Lấy danh sách tỉnh thành
  useEffect(() => {
    if (provinces.length === 0) fetchProvinces();
  }, [provinces, fetchProvinces]);

  const handleDeletePost = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?"))
      return;
    try {
      setIsLoading(true);
      await deletePost(data._id);
      toast.success("Bài đăng đã bị xóa.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Không thể xóa bài đăng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUserId || !data.userId) return;
    setIsLoading(true);
    try {
      if (isFollowing) {
        await (currentUserId, data.userId);
        toast.success("Đã bỏ theo dõi.");
      } else {
        await (currentUserId, data.userId);
        toast.success("Đã theo dõi.");
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Có lỗi xảy ra khi thay đổi trạng thái theo dõi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReport = async () => {
    try {
      await reportPost(data._id, currentUserId);
      toast.success("Đã báo cáo bài đăng.");
    } catch (error) {
      console.error("Error reporting post:", error);
      toast.error("Không thể báo cáo bài đăng.");
    }
  };

  const getProvinceName = (location) => {
    const province = provinces.find((p) => p.id === Number(location));
    return province?.name || "Không xác định";
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const difference = now - new Date(timestamp);
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
  };

  return (
    <div className="post-container border rounded-lg p-4 mb-4">
      {/* Hình ảnh bài đăng */}
      {data.images && data.images.length > 0 && (
        <Link to={`/post/${data._id}`}>
          <img
            src={data.images[0]}
            alt="Hình ảnh bài đăng"
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        </Link>
      )}

      {/* Thông tin bài đăng */}
      <div>
        <h2 className="text-xl font-bold">{data.title}</h2>
        <p className="text-gray-600">
          Mô tả: {data.description || "Không có mô tả"}
        </p>
        <p>Danh mục: {data.category}</p>
        <p>Giá: {data.price.toLocaleString()} VND</p>
        <p>Địa điểm: {getProvinceName(data.location)}</p>
        <p>Ngày đăng: {formatTimeAgo(data.createdAt)}</p>
        <p>Người đăng: {username}</p>
      </div>

      {/* Nút chức năng */}
      <div className="flex mt-4 space-x-2">
        {!isCurrentUserPost && (
          <>
            <button
              onClick={handleFollowToggle}
              disabled={isLoading}
              className={`px-4 py-2 rounded ${
                isFollowing ? "bg-red-500" : "bg-blue-500"
              } text-white`}
            >
              {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
            </button>
            <button
              onClick={handleReport}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Báo cáo
            </button>
          </>
        )}
        {isCurrentUserPost && (
          <button
            onClick={handleDeletePost}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Xóa bài
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
