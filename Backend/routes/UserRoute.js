import express from "express";
import {
  changeRole,
  fetchFollowingStatus,
  followUser,
  getUserById,
  unfollowUser,
  updateProfile,
  updateUserInfo,
} from "../Controllers/AccountController.js";
import { protectRoute } from "../lib/check.js";

const router = express.Router();
router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-profile-info", protectRoute, updateUserInfo);
router.get("/profile/:userId", getUserById);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:targetUserId/is-following", fetchFollowingStatus);
router.put("/change-role", protectRoute, changeRole);
export default router;
