import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../Controllers/AccountController";

const router = express.Router();

router.get("/profile/:id", getUserProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
