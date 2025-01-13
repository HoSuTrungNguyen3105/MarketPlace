import React from "react";
import { FaUsers, FaNewspaper, FaCogs, FaPhoneSquareAlt } from "react-icons/fa";
import { MessageCircleCode, MessageCircleMore, Settings } from "lucide-react";
import { MdPostAdd, MdReportProblem } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; // Giả sử bạn sử dụng zustand hoặc một cách nào đó để lưu trữ thông tin người dùng.

const SidebarItem = ({ to, icon, label }) => (
  <li className="sidebar-item">
    <Link to={to} className="sidebar-link">
      <div className="sidebar-item-content">
        <span className="sidebar-item-icon">{icon}</span>
        <span className="sidebar-item-label">{label}</span>
      </div>
    </Link>
  </li>
);

const AdminSidebar = () => {
  const { authUser } = useAuthStore(); // Lấy thông tin người dùng từ store

  // Mục sidebar dành cho admin
  const adminSidebarItems = [
    {
      to: "/admin/posts",
      icon: <FaPhoneSquareAlt />,
      label: "Quản lý Bài đăng",
    },
    { to: "/admin/users", icon: <FaUsers />, label: "Quản lý Người dùng" },
    {
      to: "/admin-dashboard/admin-adv",
      icon: <FaNewspaper />,
      label: "Quản lý Quảng cáo",
    },
    {
      to: "/admin-dashboard/admin-report",
      icon: <FaCogs />,
      label: "Thống kê",
    },
    {
      to: "/admin-dashboard/admin-message",
      icon: <MessageCircleCode />,
      label: "Tin nhắn",
    },
    {
      to: "/admin-dashboard/admin-report-post",
      icon: <MdReportProblem />,
      label: "Quản lý Báo cáo",
    },
    {
      to: "/admin-dashboard/admin-all-chat",
      icon: <MessageCircleMore />,
      label: "Quản lý tin nhắn",
    },
    {
      to: "/admin-dashboard/admin-setting",
      icon: <Settings />,
      label: "Cài đặt",
    },
  ];

  // Mục sidebar dành cho seller
  const sellerSidebarItems = [
    { to: "/seller/dashboard", icon: <MdPostAdd />, label: "Bảng điều khiển" },
    { to: "/seller/products", icon: <FaUsers />, label: "Quản lý Sản phẩm" },
    { to: "/seller/orders", icon: <FaNewspaper />, label: "Đơn hàng" },
    { to: "/seller/settings", icon: <Settings />, label: "Cài đặt" },
  ];

  // Render sidebar items dựa trên role
  const sidebarItems =
    authUser?.role === "admin" ? adminSidebarItems : sellerSidebarItems;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <p>
            {authUser?.role === "admin"
              ? "Admin Dashboard"
              : "Seller Dashboard"}
          </p>
        </div>
        <ul className="sidebar-nav">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
