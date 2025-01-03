import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketplacePost", // Tham chiếu đến bài viết
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Người mua
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Người bán
      required: true,
    },
    amount: {
      type: Number, // Tổng số tiền giao dịch
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"], // Trạng thái giao dịch
      default: "pending",
    },
    transactionDate: {
      type: Date,
      default: Date.now, // Ngày giao dịch
    },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = mongoose.model("Transaction", transactionSchema);

export default TransactionModel;
