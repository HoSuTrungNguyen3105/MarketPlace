import express from "express";
import {
  checkAuth,
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

export default router;
