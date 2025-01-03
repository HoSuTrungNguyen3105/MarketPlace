import { Settings2Icon } from "lucide-react";
import React from "react";

const Sidebar = () => {
  return (
    <div
      id="site__sidebar"
      className="fixed top-0 left-0 z-[99] pt-[--m-top] overflow-hidden transition-transform xl:duration-500 max-xl:w-full max-xl:-translate-x-full"
    >
      <div className="p-2 max-xl:bg-white shadow-sm 2xl:w-72 sm:w-64 w-[80%] h-[calc(100vh-64px)] relative z-30 max-lg:border-r dark:max-xl:!bg-slate-700 dark:border-slate-700">
        <div className="pr-4" data-simplebar>
          <nav id="side">
            <ul>
              <li>
                <a href="#">
                  <img
                    src="~/images/icons/home.png"
                    className="w-6"
                    alt="Home"
                  />
                  <span>Feed</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <img
                    src="~/images/icons/page.png"
                    className="w-6"
                    alt="Favorites"
                  />
                  <span>Favorites</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <img
                    src="~/images/icons/group-2.png"
                    className="w-6"
                    alt="Friends"
                  />
                  <span>Friends</span>
                </a>
              </li>
            </ul>
          </nav>
          <nav
            id="side"
            className="font-medium text-sm text-black border-t pt-3 mt-2"
          >
            <div className="px-3 pb-2 text-sm font-medium">
              <div className="text-black">Pages</div>
            </div>

            <ul className="mt-2 -space-y-2">
              <li>
                <a href="#">
                  <Settings2Icon />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div
        id="site__sidebar__overly"
        className="absolute top-0 left-0 z-20 w-screen h-screen xl:hidden backdrop-blur-sm"
      />
    </div>
  );
};

export default Sidebar;
