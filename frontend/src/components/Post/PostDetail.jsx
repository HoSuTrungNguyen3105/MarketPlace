import React, { useEffect, useMemo, useState } from "react";
import { usePostStore } from "../../store/userPostStore";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import {
  MapPin,
  Phone,
  MessageSquare,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import "./Detail.css";
import { useMessageStore } from "../../store/useMessageStore";
import { useUserStore } from "../../store/useUserStore";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getContacts,
    contacts,
    isLoading: isContactsLoading,
    selectedUser,
    setSelectedUser,
  } = useMessageStore();
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const { getPostById, post, isLoading, fetchOtherPosts, otherPosts } =
    usePostStore();
  const { authUser } = useAuthStore();
  const { followUser, unfollowUser, fetchFollowingStatus } = useUserStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getPostById(id);
      getContacts();
    }
  }, [id, getPostById, getContacts]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (authUser && post && post.userId) {
        const status = await fetchFollowingStatus(authUser._id, post.userId);
        setIsUserFollowing(status);
      }
    };
    if (authUser && post) {
      checkFollowStatus();
    }
  }, [authUser, post, fetchFollowingStatus]);

  const handleFollowToggle = async () => {
    if (!authUser || !post.userId) return;
    setIsFollowLoading(true);
    try {
      if (isUserFollowing) {
        await unfollowUser(authUser._id, post.userId);
        setIsUserFollowing(false);
      } else {
        await followUser(authUser._id, post.userId);
        setIsUserFollowing(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : post?.images?.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < post?.images?.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleChat = (user) => {
    setSelectedUser(user); // Cập nhật người dùng được chọn
    navigate(`/message/${user._id}`); // Chuyển hướng đến trang nhắn tin (nếu cần)
  };

  const breadcrumbs = useMemo(() => {
    return [
      { name: "Home", path: "/" },
      { name: "Bài viết", path: "/post" },
      { name: post?.title || "Post", path: `/post/${id}` },
    ];
  }, [post, id]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!post) return <div className="text-center py-10">Post not found!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Breadcrumb */}
      <nav>
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            <Link to={crumb.path}>{crumb.name}</Link>
            {index < breadcrumbs.length - 1 && " › "}
          </span>
        ))}
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="relative">
          <div className="relative aspect-square">
            <img
              src={post.images[currentImageIndex]}
              alt="Product"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-white/80 p-2 rounded-full">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {post.images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-4">
            {post.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  currentImageIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="text-2xl font-bold text-red-500 mb-6">
            {post.price} đ
          </div>
          {post.views} Người xem
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>Đăng {post.createdAt}</span>
            </div>
          </div>
          {/* Seller Info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                post.userId.profilePic || "/placeholder.svg?height=48&width=48"
              }
              alt="img"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {post.userId.username}
                {post.userId.isVerified && (
                  <span className="text-green-500">✓</span>
                )}
                {!post.userId.isVerified && (
                  <span className="text-blue-500">Chưa xác thực</span>
                )}
              </h3>
              <div className="text-sm text-gray-500 flex items-center gap-4">
                <span>{post.userId.soldItems} đã bán</span>
                <span>{post.userId.activeListings} đang bán</span>
              </div>
              <div className="text-sm text-gray-500">
                Hoạt động {post.userId.lastActive} • Phản hồi:{" "}
                {post.userId.responseRate}%
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Gọi điện
            </button>
            {contacts.map((contact) => (
              <button
                key={contact._id}
                onClick={() => handleChat(contact)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                  selectedUser?._id === contact._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Chat với {contact.username}
              </button>
            ))}
          </div>
          {/* Follow Button */}
          {authUser && authUser._id !== post.userId && (
            <button
              className={`button fc-button ${
                isUserFollowing ? "unfollow" : "follow"
              }`}
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
            >
              {isFollowLoading
                ? "Loading..."
                : isUserFollowing
                ? "Đã theo dõi"
                : "Theo dõi"}
            </button>
          )}
          {/* Hiển thị mô tả với xử lý khoảng trắng và xuống dòng */}
          {/* <div
            className="mt-6 text-gray-700"
            dangerouslySetInnerHTML={{
              __html: post.description
                .replace(/\n/g, "<br />") // Thay dấu xuống dòng bằng <br />
                .replace(/ /g, "&nbsp;"), // Thay khoảng trắng bằng &nbsp;
            }}
          />{" "} */}
          {/* Hiển thị mô tả với việc thay thế {{newline}} thành dấu xuống dòng */}
          {/* Description */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h2>
            <div className="text-gray-700">
              {post.description.split("{{newline}}").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
          {/* Other Posts */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Sản phẩm khác</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* {otherPosts.map((item) => (
                <Link
                  to={`/post/${item._id}`}
                  key={item._id}
                  className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-red-500 font-bold">{item.price} đ</p>
                  </div>
                </Link>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
