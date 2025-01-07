import React, { useEffect, useState } from "react";
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

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getPostById, post, isLoading, error, updatePost, deletePost } =
    usePostStore();
  const { authUser } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getPostById(id);
    }
  }, [id]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : post.images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < post.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleMessage = () => {
    navigate("/chatbox");
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not found!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm py-4">
        <Link to="/" className="text-blue-600">
          Chợ Tốt Xe
        </Link>
        <span>›</span>
        <Link to="/xe-dien" className="text-blue-600">
          Xe điện
        </Link>
        <span>›</span>
        <Link to="/xe-dien-tp-ho-chi-minh" className="text-blue-600">
          Xe điện Tp Hồ Chí Minh
        </Link>
        <span>›</span>
        <Link to="/xe-dien-quan-3" className="text-blue-600">
          Xe điện Quận 3
        </Link>
        <span>›</span>
        <span className="text-gray-600">{post.title}</span>
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
                {post.userId}
                {authUser.isVerified && (
                  <span className="text-green-500">✓</span>
                )}
                {!authUser.isVerified && (
                  <span className="text-blue-500">Chưa xác thực </span>
                )}
              </h3>
              <div className="text-sm text-gray-500 flex items-center gap-4">
                <span>{authUser.soldItems} đã bán</span>
                <span>{authUser.activeListings} đang bán</span>
              </div>
              <div className="text-sm text-gray-500">
                Hoạt động {authUser.lastActive} • Phản hồi:{" "}
                {authUser.responseRate}%
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Gọi điện
            </button>
            <button
              className="w-full border border-green-500 text-green-500 py-3 rounded-lg flex items-center justify-center gap-2"
              onClick={handleMessage}
            >
              <MessageSquare className="w-5 h-5" />
              Chat
            </button>
          </div>
          {/* Status */}
          <div className="flex justify-between mt-6">
            <button className="text-gray-500">Xe còn hay đã bán rồi?</button>
            <button className="text-gray-500">Xe chính chủ</button>
          </div>
          {/* Help & Report */}
          <div className="flex justify-between mt-6">
            <button className="flex items-center gap-2 text-gray-500">
              <span className="w-5 h-5">🎧</span>
              Cần trợ giúp
            </button>
            <button className="flex items-center gap-2 text-gray-500">
              <span className="w-5 h-5">⚠️</span>
              Báo cáo tin đăng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
