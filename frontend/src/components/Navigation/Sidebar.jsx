import {
  EggFried,
  FileArchiveIcon,
  FileEdit,
  Settings2Icon,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

const Sidebar = () => {
  return (
    <div className="sticky top-0 left-0 z-[99] h-full w-64 bg-white">
      <div className="p-4 overflow-y-auto h-full">
        <nav>
          <ul>
            <li>
              <Link to="/feed" className="flex items-center">
                <FileEdit />
                <span>Feed</span>
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="flex items-center">
                <FileArchiveIcon />
                <span>Favorites</span>
              </Link>
            </li>
            <li>
              <Link to="/friends" className="flex items-center">
                <EggFried />
                <span>Friends</span>
              </Link>
            </li>
          </ul>
          <div className="mt-6 border-t pt-3">
            <ul>
              <li>
                <Link to="/settings" className="flex items-center">
                  <Settings2Icon className="inline-block mr-2" />
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
