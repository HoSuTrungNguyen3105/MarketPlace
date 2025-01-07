import { Link } from "react-router-dom";
import "./Detail.css";

const Post = ({ data, currentUserId }) => {
  // const handleDeletePost = async () => {
  //   if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?"))
  //     return;
  //   try {
  //     setIsLoading(true);
  //     await deletePost(data._id);
  //     toast.success("Bài đăng đã bị xóa.");
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     toast.error("Không thể xóa bài đăng.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Hàm xử lý khi bấm vào bài viết
  // const handleViewPost = async (postId) => {
  //   try {
  //     await axiosInstance.get(`/post/detail/${postId}`);
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật lượt xem:", error);
  //   }
  // };

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
    <div className="contain border rounded-lg p-4 mb-4 shadow-sm hover:shadow-lg transition-shadow duration-200">
      {/* Hình ảnh bài đăng */}
      {data.images && data.images.length > 0 && (
        <Link to={`/post/${data._id}`}>
          <img
            src={data.images[0]}
            alt="Hình ảnh bài đăng"
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        </Link>
      )}

      {/* Thông tin bài đăng */}
      <div className="flex flex-col">
        <h2 className="text-base font-bold mb-1 text-gray-800 truncate">
          {data.title}
        </h2>
        <p className="text-sm text-gray-600 mb-1 truncate">
          {data.category} - {data.description || "Không có mô tả"}
        </p>
        <p className="text-red-500 font-bold text-lg mb-1">{data.price} VND</p>
        <p className="text-gray-500 text-xs">
          {formatTimeAgo(data.createdAt)} - {data.location || "Không rõ"}
        </p>
      </div>

      {/* Biểu tượng yêu thích và nút thêm */}
      <div className="flex justify-between items-center mt-3">
        <button className="p-1 rounded-full hover:bg-gray-100">❤️</button>
        <div className="text-gray-500 cursor-pointer">
          <span>⋮</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
