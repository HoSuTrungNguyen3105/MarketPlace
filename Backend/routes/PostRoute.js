import express from "express";
import { createPost, getAllPosts } from "../Controllers/PostController.js";
import { uploadMiddleware } from "../lib/multer.js";

const router = express.Router();

router.get("/allProducts", getAllPosts);
router.post("/posts", uploadMiddleware, createPost); // Để tạo bài viết

export default router;
