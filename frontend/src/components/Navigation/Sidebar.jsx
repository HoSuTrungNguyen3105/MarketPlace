import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import {
  EggFried,
  FileArchiveIcon,
  FileEdit,
  Settings2Icon,
} from "lucide-react";
import { MdResetTv } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const currentPath = location.pathname;

  return (
    <div className="sticky top-0 left-0 z-[99] h-full w-64 bg-white shadow-lg">
      <div className="p-4 overflow-y-auto h-full">
        <nav>
          <ul>
            <li>
              <Link
                to="/post"
                className={`flex items-center p-2 rounded-lg ${
                  currentPath === "/post" ? "bg-gray-200 font-bold" : ""
                }`}
              >
                <FileEdit className="mr-2" />
                <span>Feed</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`flex items-center p-2 rounded-lg ${
                  currentPath === "/profile" ? "bg-gray-200 font-bold" : ""
                }`}
              >
                <FileArchiveIcon className="mr-2" />
                <span>Favorites</span>
              </Link>
            </li>
            <li>
              <Link
                to="/reset-password/:token"
                className={`flex items-center p-2 rounded-lg ${
                  currentPath === "/reset-password"
                    ? "bg-gray-200 font-bold"
                    : ""
                }`}
              >
                <MdResetTv className="mr-2" />
                <span>Reset</span>
              </Link>
            </li>
          </ul>
          <div className="mt-6 border-t pt-3">
            <ul>
              <li>
                <Link
                  to="/message"
                  className={`flex items-center p-2 rounded-lg ${
                    currentPath === "/settings" ? "bg-gray-200 font-bold" : ""
                  }`}
                >
                  <Settings2Icon className="mr-2" />
                  <span>Settings</span>
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
