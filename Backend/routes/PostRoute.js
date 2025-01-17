import express from "express";
import {
  addBookmark,
  checkBookmarkStatus,
  createPost,
  delete1UserPost,
  deleteMark,
  fetchAllPost,
  getAllPosts,
  getBookmarks,
  getCategories,
  getPost,
  getPostbyid,
  getPostbyidwithoutUser,
  getPostToProfile,
  provinces,
  reportPost,
} from "../Controllers/PostController.js";
import { uploadMiddleware } from "../lib/multer.js";
import { protectRoute } from "../lib/check.js";
const router = express.Router();

router.post("/posts", uploadMiddleware, createPost); // Để tạo bài viết
router.post("/fetchpost", fetchAllPost); // Để tạo bài viết

router.get("/posts/:id", getPost); // Để lấy một bài viết theo id
router.get("/detail/:id", getPostbyid); // Để lấy bài viết theo id
router.get("/detail/without/:id", getPostbyidwithoutUser); // Để lấy bài viết theo id
router.get("/categories", getCategories);
router.get("/postsId/allItems", getAllPosts); // Để lấy tất cả bài viết
router.post("/report/:postId", reportPost);
router.delete("/user/:id", protectRoute, delete1UserPost); // Để xóa bài viết
router.get("/user/:id", getPostToProfile); // Để lấy một bài viết theo id
router.get("/provinces", (req, res) => {
  res.json(provinces); // Trả về dữ liệu tỉnh thành
});
router.post("/bookmark", protectRoute, addBookmark); // Gọi hàm createTransaction
router.delete("/bookmark/:postId", protectRoute, deleteMark); // Gọi hàm deleteTransaction
router.get("/:postId/bookmarks/:userId", protectRoute, getBookmarks);
router.get("/bookmark/:postId", protectRoute, checkBookmarkStatus);
export default router;
