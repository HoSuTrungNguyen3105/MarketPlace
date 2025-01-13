import { Link } from "react-router-dom";
import "./Detail.css";
import { useUserStore } from "../../store/useUserStore";
import { useEffect, useState } from "react";

const Post = ({ data, currentUserId }) => {
  const isCurrentUserPost = currentUserId === (data.userId?._id || data.userId);
  const {
    following,
    fetchFollowingStatus,
    followUser,
    unfollowUser,
    setFollowing,
  } = useUserStore();
  const userId =
    data?.userId?._id ||
    (typeof data?.userId === "string" ? data.userId : null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const isFollowing = await fetchFollowingStatus(currentUserId, userId);
        setFollowing(userId, isFollowing);
      } catch (error) {
        console.error("Failed to fetch follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUserId && userId) fetchFollowStatus();
  }, [currentUserId, userId, fetchFollowingStatus, setFollowing]);

  const isUserFollowing = following[userId] || false;

  // Xử lý theo dõi người dùng
  const handleFollow = async () => {
    if (!currentUserId || !userId) return;
    setIsLoading(true);
    try {
      await followUser(currentUserId, userId);
      setFollowing(userId, true);
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý bỏ theo dõi người dùng
  const handleUnfollow = async () => {
    if (!currentUserId || !userId) return;
    setIsLoading(true);
    try {
      await unfollowUser(currentUserId, userId);
      setFollowing(userId, false);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="contain border border-gray-200 rounded-lg p-5 mb-5 shadow-sm hover:shadow-lg transition-shadow duration-150">
      {Array.isArray(data.images) && data.images.length > 0 ? (
        <Link to={`/post/${data._id}?userId=${userId}`}>
          <img
            src={data.images[0]}
            alt="Hình ảnh bài đăng"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        </Link>
      ) : (
        <Link to={`/post/${data._id}?userId=${userId}`}>
          <img
            src="https://cdn-icons-png.freepik.com/256/15058/15058095.png?semt=ais_hybrid"
            alt="Hình ảnh mặc định"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        </Link>
      )}

      {/* Tiêu đề và danh mục */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 truncate mb-2">
          {data.title}
        </h2>
        <p className="text-sm text-gray-600 mb-2 truncate">
          {data.category} -{" "}
          {(() => {
            const description = (data.description || "").replace(
              /{{newline}}/g,
              " "
            );

            const words = description.split(" ");
            if (words.length > 5) {
              return (
                <>
                  {words.slice(0, 5).join(" ")}...{" "}
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => alert(description)}
                  >
                    Xem thêm
                  </span>
                </>
              );
            } else {
              return description;
            }
          })()}
        </p>
        <p className="text-red-500 font-bold text-xl mb-3">
          {data.price.toLocaleString()} VND
        </p>
        <p className="text-xs text-gray-500">{formatTimeAgo(data.createdAt)}</p>
      </div>

      {/* Nút tương tác */}
      <div className="flex items-center mt-4 space-x-4">
        {currentUserId && !isCurrentUserPost && (
          <button
            className={`px-4 py-2 rounded-md text-white ${
              isUserFollowing
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={isUserFollowing ? handleUnfollow : handleFollow}
            disabled={isLoading}
          >
            {isLoading
              ? "Đang tải..."
              : isUserFollowing
              ? "Đã theo dõi"
              : "Theo dõi"}
          </button>
        )}
        {isCurrentUserPost && (
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Xóa bài
          </button>
        )}
      </div>

      {/* Biểu tượng yêu thích và nút thêm */}
      <div className="flex justify-between items-center mt-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-150">
          ❤️
        </button>
        <div className="text-gray-500 cursor-pointer hover:text-gray-700">
          <span>⋮</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
