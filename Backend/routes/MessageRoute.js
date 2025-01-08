import express from "express";
import { protectRoute } from "../lib/check.js";
import {
  deleteMessage,
  getChatWithUser,
  getContacts,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../Controllers/MessageController.js";

const router = express.Router();

//router.post('/', addMessage)
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/contacts", protectRoute, getContacts);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/:messageId", deleteMessage);
router.get("/chat/:userId", getChatWithUser);
export default router;
