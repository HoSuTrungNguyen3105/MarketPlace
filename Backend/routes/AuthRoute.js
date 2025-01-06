import express from "express";
import {
  checkAuth,
  checkUserStatus,
  dataRoute,
  forgetPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  resetPasswordFromForget,
  verifyEmail,
} from "../Controllers/AuthController.js";
import { protectRoute } from "../lib/check.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/data/role", dataRoute);
router.post("/verify-email", verifyEmail);
router.get("/check", protectRoute, checkAuth);
router.get("/check-status", protectRoute, checkUserStatus);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password-from-forget/:token", resetPasswordFromForget);

router.post("/reset-password/:token", resetPassword);
export default router;
