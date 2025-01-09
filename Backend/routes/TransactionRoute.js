import express from "express";
import { protectRoute } from "../lib/check.js";
import {
  checkTransactionStatus,
  createTransaction,
  getTransactionById,
  getTransactions,
  updateTransactionStatus,
} from "../Controllers/TransactionController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransactionStatus);
router.get("/check", checkTransactionStatus);
export default router;
