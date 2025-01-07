import express from "express";
import {
  createPost,
  getAllPosts,
  getCategories,
  getPost,
  reportPost,
} from "../Controllers/PostController.js";
import { uploadMiddleware } from "../lib/multer.js";
// import { upload } from "../lib/multer.js";
const router = express.Router();

router.post("/posts", uploadMiddleware, createPost); // Để tạo bài viết
router.get("/posts/:id", getPost); // Để lấy một bài viết theo id
// router.get("/posts/user/:id", getPostToProfile); // Để lấy một bài viết theo id
// router.put("/update/:id", protectRoute, updatePost);
// router.delete("/posts/:id", protectRoute, deletePost); // Để xóa bài viết
// router.delete("/user/:id", protectRoute, delete1UserPost); // Để xóa bài viết

router.get("/categories", getCategories);
router.get("/postsId/allItems", getAllPosts); // Để lấy tất cả bài viết
// router.get("/provinces", (req, res) => {
//   res.json(provinces); // Trả về dữ liệu tỉnh thành
// });
router.post("/report/:postId", reportPost);
// router.get("/search", search);
// router.get("/posts/detail/:id", getPostbyid); // Để lấy bài viết theo id
// router.get("/postsId/getRecently", getRecentlyPosts); // Để lấy bài viết theo id
// router.get("/postsId/getOldest", getOldestPosts); // Để lấy bài viết theo id
// router.get("/getPostAp", getPostApprove); // Để lấy bài viết theo id
// router.put("/approve/:id", approvePosts);

export default router;
