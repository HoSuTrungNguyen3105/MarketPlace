import { Settings2Icon } from "lucide-react";
import React from "react";

const Sidebar = () => {
  return (
    <div className=" top-0 left-0 z-[99] h-full w-64 bg-white">
      <div className="p-4 overflow-y-auto h-full">
        <nav>
          <ul>
            <li>
              <a href="#">
                <img
                  src="~/images/icons/home.png"
                  className="w-6 inline-block mr-2"
                  alt="Home"
                />
                <span>Feed</span>
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src="~/images/icons/page.png"
                  className="w-6 inline-block mr-2"
                  alt="Favorites"
                />
                <span>Favorites</span>
              </a>
            </li>
            <li>
              <a href="#">
                <img
                  src="~/images/icons/group-2.png"
                  className="w-6 inline-block mr-2"
                  alt="Friends"
                />
                <span>Friends</span>
              </a>
            </li>
          </ul>
          <div className="mt-6 border-t pt-3">
            <ul>
              <li>
                <a href="#">
                  <Settings2Icon className="inline-block mr-2" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
