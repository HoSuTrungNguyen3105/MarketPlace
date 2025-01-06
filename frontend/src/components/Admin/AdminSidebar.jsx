import React from "react";
import { FaUsers, FaNewspaper, FaCogs } from "react-icons/fa";
import { MessageCircleCode, MessageCircleMore, Settings } from "lucide-react";
import { MdPostAdd, MdReportProblem } from "react-icons/md";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; // Giả sử bạn sử dụng zustand hoặc một cách nào đó để lưu trữ thông tin người dùng.

const AdminSidebar = () => {
  const { authUser } = useAuthStore(); // Giả sử đây là nơi bạn lấy thông tin người dùng từ store
  const location = useLocation();
  const dashboardData = location.state?.dashboardData || "No data provided";

  // Mục sidebar dành cho admin
  const adminSidebarItems = [
    {
      to: "/admin/posts",
      icon: <MdPostAdd />,
      label: "Quản lý Bài đăng",
    },
    {
      to: "/admin-dashboard/admin-user",
      icon: <FaUsers />,
      label: "Quản lý Người dùng",
    },
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
    {
      to: "/seller/dashboard",
      icon: <MdPostAdd />,
      label: "Bảng điều khiển",
    },
    {
      to: "/seller/products",
      icon: <FaUsers />,
      label: "Quản lý Sản phẩm",
    },
    {
      to: "/seller/orders",
      icon: <FaNewspaper />,
      label: "Đơn hàng",
    },
    {
      to: "/seller/settings",
      icon: <Settings />,
      label: "Cài đặt",
    },
  ];

  // Render sidebar items dựa trên role
  const sidebarItems =
    authUser?.role === "admin" ? adminSidebarItems : sellerSidebarItems;

  return (
    <div className="admin-layout">
      {/* Sidebar bên cạnh */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <p>{dashboardData}</p>
        </div>
        <ul className="sidebar-nav">
          {sidebarItems.map((item) => (
            <li key={item.to} className="sidebar-item">
              <Link to={item.to} className="sidebar-link">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>
                    {item.icon}
                  </span>
                  <span style={{ marginLeft: "10px" }}>{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
