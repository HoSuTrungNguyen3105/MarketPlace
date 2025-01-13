import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FcBusinessman,
  FcDataConfiguration,
  FcDataBackup,
} from "react-icons/fc";
import { TbHttpPost } from "react-icons/tb";

const Sidebar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const currentPath = location.pathname;

  return (
    <div className="sticky top-0 left-0 z-[99] h-full w-64 bg-white shadow-md rounded-lg m-4">
      <div className="p-4 overflow-y-auto h-full">
        <nav>
          <ul>
            <li>
              <Link
                to="/post"
                className={`flex items-center p-3 rounded-lg mb-2 transition-all duration-300 ${
                  currentPath === "/post"
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <TbHttpPost className="mr-3 text-xl" />
                <span className="text-lg">Posts</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`flex items-center p-3 rounded-lg mb-2 transition-all duration-300 ${
                  currentPath === "/profile"
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FcBusinessman className="mr-3 text-xl" />
                <span className="text-lg">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/reset-password/:token"
                className={`flex items-center p-3 rounded-lg mb-2 transition-all duration-300 ${
                  currentPath === "/reset-password"
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FcDataBackup className="mr-3 text-xl" />
                <span className="text-lg">Reset</span>
              </Link>
            </li>
          </ul>

          <div className="mt-6 border-t pt-3">
            <ul>
              <li>
                <Link
                  to="/settings"
                  className="flex items-center p-3 rounded-lg mb-2 transition-all duration-300 text-gray-700 hover:bg-gray-200"
                >
                  <FcDataConfiguration className="mr-3 text-xl" />
                  <span className="text-lg">Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
