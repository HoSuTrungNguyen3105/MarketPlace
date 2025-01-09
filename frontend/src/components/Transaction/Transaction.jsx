import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePostStore } from "../../store/userPostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useTransactionStore } from "../../store/useTransactionStore";

const Transaction = () => {
  const location = useLocation();
  const { postId } = location.state || {}; // Lấy postId từ state của router

  const { authUser } = useAuthStore(); // Lấy thông tin người dùng từ auth store
  const { post, getPostById } = usePostStore(); // Lấy bài viết từ post store
  const { transactionId, message, isLoading, checkTransaction } =
    useTransactionStore(); // Lấy trạng thái và hàm từ transaction store

  const [formData, setFormData] = useState({
    postId: "",
    buyerId: "",
    sellerId: "",
  });

  // Lấy thông tin bài viết dựa trên `postId`
  useEffect(() => {
    if (postId) {
      getPostById(postId);
    }
  }, [postId, getPostById]);

  // Cập nhật dữ liệu form khi bài viết hoặc thông tin người dùng thay đổi
  useEffect(() => {
    if (post && authUser) {
      setFormData({
        postId: post._id,
        sellerId: post.userId._id,
        buyerId: authUser._id,
      });
    }
  }, [post, authUser]);

  // Kiểm tra trạng thái giao dịch khi các giá trị cần thiết sẵn sàng
  useEffect(() => {
    if (formData.postId && formData.buyerId && formData.sellerId) {
      checkTransaction(formData); // Gửi dữ liệu để kiểm tra giao dịch
    }
  }, [formData.postId, formData.buyerId, formData.sellerId, checkTransaction]);

  // Hiển thị khi đang tải dữ liệu
  if (isLoading) {
    return <div>Đang kiểm tra giao dịch...</div>;
  }

  // Hiển thị giao diện
  return (
    <div className="transaction-check">
      <h2>Kiểm Tra Giao Dịch</h2>
      {transactionId ? (
        <div className="transaction-details">
          <h3>Giao Dịch Đã Tồn Tại</h3>
          <p>ID Giao Dịch: {transactionId}</p>
        </div>
      ) : (
        <div className="no-transaction">
          <p>{message || "Chưa có giao dịch nào được tạo."}</p>
        </div>
      )}
    </div>
  );
};

export default Transaction;
