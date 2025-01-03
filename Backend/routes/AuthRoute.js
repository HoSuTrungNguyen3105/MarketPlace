import express from "express";
import {
  checkAuth,
  checkUserStatus,
  dataRoute,
  loginUser,
  logoutUser,
  registerUser,
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

export default router;
