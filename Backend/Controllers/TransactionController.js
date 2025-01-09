import mongoose from "mongoose";
import TransactionModel from "../models/transactionModel.js";

// Tạo giao dịch mới
export const createTransaction = async (req, res) => {
  try {
    const { postId, buyerId, sellerId, amount, status } = req.body;

    if (!postId || !buyerId || !sellerId || !amount) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết." });
    }
    // Kiểm tra xem giao dịch đã tồn tại chưa
    const existingTransaction = await TransactionModel.findOne({
      postId,
      buyerId,
    });
    if (existingTransaction) {
      return res.status(400).json({ message: "Giao dịch đã tồn tại." });
    }
    const transaction = new TransactionModel({
      postId,
      buyerId,
      sellerId,
      amount,
      status,
    });

    await transaction.save();

    res.status(201).json({
      message: "Giao dịch đã được tạo thành công.",
      transaction,
    });
  } catch (error) {
    console.error("Lỗi khi tạo giao dịch:", error);
    res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

// Lấy danh sách giao dịch
export const getTransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.find()
      .populate("postId", "title")
      .populate("buyerId", "username")
      .populate("sellerId", "username");
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giao dịch:", error);
    res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

// Lấy chi tiết giao dịch
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ." });
    }

    const transaction = await TransactionModel.findById(id)
      .populate("postId", "title")
      .populate("buyerId", "username")
      .populate("sellerId", "username");

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch." });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết giao dịch:", error);
    res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

// Cập nhật trạng thái giao dịch
export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = await TransactionModel.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch." });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      message: "Trạng thái giao dịch đã được cập nhật.",
      transaction,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái giao dịch:", error);
    res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

// Kiểm tra giao dịch bằng ID
export const checkTransactionStatus = async (req, res) => {
  const { id } = req.query;

  try {
    // Kiểm tra ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ." });
    }

    // Tìm giao dịch dựa trên ID
    const transaction = await TransactionModel.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Giao dịch không tồn tại." });
    }

    // Nếu giao dịch tồn tại
    res.status(200).json({
      exists: true,
      message: "Giao dịch đã tồn tại.",
      transaction,
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra giao dịch:", error);
    res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
