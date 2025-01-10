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
    <div className="contain border rounded-lg p-5 mb-5 shadow-sm hover:shadow-lg transition-shadow duration-150">
      {/* Hình ảnh bài đăng */}
      {data.images && data.images.length > 0 && (
        <Link to={`/post/${data._id}?userId=${userId}`}>
          <img
            src={data.images[0]}
            alt="Hình ảnh bài đăng"
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        </Link>
      )}
      <Link to={`/post/${data._id}?userId=${userId}`}>
        <div>Chi tiết</div>
      </Link>
      {/* Thông tin bài đăng */}
      <div className="flex flex-col">
        <h2 className="text-base font-bold mb-1 text-gray-800 truncate">
          {data.title}
        </h2>
        <p className="text-sm text-gray-600 mb-1 truncate">
          {data.category} -{" "}
          {(() => {
            const description = (data.description || "").replace(
              /{{newline}}/g,
              " "
            );

            const words = description.split(" "); // Tách chuỗi thành các từ
            if (words.length > 5) {
              return (
                <>
                  {words.slice(0, 5).join(" ")}...{" "}
                  <span
                    className="text-blue-500 cursor-pointer"
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

        <p className="text-red-500 font-bold text-lg mb-1">{data.price} VND</p>
        <p className="text-gray-500 text-xs">{formatTimeAgo(data.createdAt)}</p>
      </div>
      {/* Nút tương tác */}
      <div className="postReact">
        {currentUserId && !isCurrentUserPost && (
          <>
            <button
              className={`report-btn button btn-danger ${
                isUserFollowing ? "unfollow" : "follow"
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
          </>
        )}
        {isCurrentUserPost && (
          <button className="delete-btn button btn-danger ml-2">Xóa bài</button>
        )}
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
