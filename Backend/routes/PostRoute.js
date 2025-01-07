import express from "express";
import {
  createPost,
  getAllPosts,
  getCategories,
  getPost,
  getPostbyid,
  reportPost,
} from "../Controllers/PostController.js";
import { uploadMiddleware } from "../lib/multer.js";
const router = express.Router();

router.post("/posts", uploadMiddleware, createPost); // Để tạo bài viết
router.get("/posts/:id", getPost); // Để lấy một bài viết theo id
router.get("/detail/:id", getPostbyid); // Để lấy bài viết theo id
router.get("/categories", getCategories);
router.get("/postsId/allItems", getAllPosts); // Để lấy tất cả bài viết
router.post("/report/:postId", reportPost);

export default router;
