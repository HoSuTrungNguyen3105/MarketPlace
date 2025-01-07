import express from "express";
import {
  getUserById,
  updateProfile,
  updateUserInfo,
} from "../Controllers/AccountController.js";
import { protectRoute } from "../lib/check.js";

const router = express.Router();
router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-profile-info", protectRoute, updateUserInfo);
router.get("/profile/:userId", getUserById);

export default router;
