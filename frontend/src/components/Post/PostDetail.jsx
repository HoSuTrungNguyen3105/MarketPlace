import React, { useEffect, useState } from "react";
import { usePostStore } from "../../store/userPostStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import "./Detail.css";
const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy query string từ URL
  const { getPostById, post, isLoading, error, updatePost, deletePost } =
    usePostStore(); // Add deletePost
  const { authUser } = useAuthStore();
  const [user, setUserId] = useState(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fetchedUserId = queryParams.get("userId");
    setUserId(fetchedUserId);
  }, [location]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    description: "",
    title: "",
    contact: "",
    category: "",
    location: "",
    images: "",
  });
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0); // Quay lại ảnh đầu tiên nếu đã hết
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(post.images.length - 1); // Quay lại ảnh cuối cùng nếu ở ảnh đầu
    }
  };
  useEffect(() => {
    if (id) {
      getPostById(id);
    }
  }, [id, getPostById]);

  useEffect(() => {
    if (post) {
      setEditedPost({
        desc: post.desc,
        contact: post.contact,
        location: post.location,
        image: post.image,
      });
    }
  }, [post]);

  const handleGoBack = () => navigate(-1);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updatePost({ ...post, ...editedPost });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPost({
      desc: post.desc,
      contact: post.contact,
      location: post.location,
      image: post.image,
    });
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedPost((prevState) => ({
          ...prevState,
          image: reader.result, // Lưu base64 vào state
        }));
      };
      reader.readAsDataURL(file); // Chuyển file sang base64
    }
  };

  const handleMessage = () => {
    if (!isUserFollowing) {
      alert("Bạn cần theo dõi trước khi nhắn tin!");
    } else {
      navigate("/chatbox");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn chắc chắn muốn xóa bài đăng này?")) {
      try {
        await deletePost(post._id); // Call deletePost to remove the post
        navigate("/"); // Navigate to the homepage or any other page
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found!</div>;

  return (
    <div className="post-detail">
      <div className="post-header">
        {user && (
          <p>
            <b>Người đăng:</b> {user}
          </p>
        )}
        {authUser && (
          <button className="button btn-back" onClick={handleGoBack}>
            Quay lại
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="edit-form">
          <textarea
            name="desc"
            value={editedPost.description}
            onChange={handleInputChange}
            placeholder="Mô tả"
          />
          <input
            type="text"
            name="contact"
            value={editedPost.contact}
            onChange={handleInputChange}
            placeholder="Liên hệ"
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />

          <div className="edit-actions">
            <button onClick={handleSave}>Lưu</button>
            <button onClick={handleCancel}>Hủy</button>
          </div>
        </div>
      ) : (
        <div className="post-info">
          <p className="post-description">{post.description}</p>
          {post.images && post.images.length > 0 && (
            <div className="image-container">
              <button
                className="arrow-button left-arrow"
                onClick={handlePrevImage}
              >
                &lt;
              </button>
              <img
                src={post.images[currentImageIndex]}
                alt={`Post image ${currentImageIndex + 1}`}
                className="post-image"
              />
              <button
                className="arrow-button right-arrow"
                onClick={handleNextImage}
              >
                &gt;
              </button>
            </div>
          )}

          <p className="post-contact">
            <button className="contact-button">
              Liên lạc qua số: {post.contact}
            </button>
          </p>
          <p className="post-location"></p>
        </div>
      )}

      {/* Edit Button */}
      {authUser && authUser._id === post.userId && !isEditing && (
        <div className="postReact">
          <button className="button fc-button" onClick={handleEditClick}>
            Sửa
          </button>
          <button className="button fc-button" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      )}

      <div className="postReact">
        {authUser && authUser._id !== post.userId && (
          <>
            <button className="button fc-button" onClick={handleMessage}>
              Nhắn Tin
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
