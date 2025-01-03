import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const params = useLocation();
  const searchText = params.search.slice(3);

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  //   const confirmLogout = (event) => {
  //     event.preventDefault();
  //     const confirmation = window.confirm("Are you sure you want to log out?");
  //     if (confirmation) {
  //       // Redirect to logout endpoint (You can change this route to your own logout route)
  //       history.push("/logout");
  //     }
  //   };

  return (
    <header className="z-[100] h-[--m-top] fixed top-0 left-0 w-full flex items-center bg-white/80 sky-50 backdrop-blur-xl border-b border-slate-200">
      <div className="2xl:w-[--w-side] lg:w-[--w-side-sm]">
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-gray-100 xl:hidden group">
            <icon-icon
              name="menu-outline"
              className="text-2xl group-aria-expanded:hidden"
            ></icon-icon>
            <ion-icon
              name="close-outline"
              className="hidden text-2xl group-aria-expanded:block"
            ></ion-icon>
          </button>

          <div id="logo" className="flex items-center">
            <a className="flex items-center">
              <img
                src="~/images/logo.png"
                className="w-10 md:block hidden"
                alt="Logo"
              />
              <span className="ml-2">Circle App</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="max-w-[1220px] mx-auto flex items-center">
          <form
            id="search--box"
            className="xl:w-[680px] sm:w-96 sm:relative rounded-xl overflow-hidden z-20 bg-secondery max-md:hidden w-screen left-0 max-sm:fixed max-sm:top-2"
          >
            <div className="w-full h-full">
              {!isSearchPage ? (
                //not in search page
                <div className="w-full h-full flex items-center">
                  <TypeAnimation
                    sequence={[
                      // Same substring at the start will only be typed out once, initially
                      'Search "milk"',
                      1000, // wait 1s before replacing "Mice" with "Hamsters"
                      'Search "bread"',
                      1000,
                      'Search "sugar"',
                      1000,
                      'Search "panner"',
                      1000,
                      'Search "chocolate"',
                      1000,
                      'Search "curd"',
                      1000,
                      'Search "rice"',
                      1000,
                      'Search "egg"',
                      1000,
                      'Search "chips"',
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                  />
                </div>
              ) : (
                //when i was search page
                <div className="w-full h-full">
                  <input
                    type="text"
                    placeholder="Search for atta dal and more."
                    autoFocus
                    defaultValue={searchText}
                    className="bg-transparent w-full h-full outline-none"
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="max-w-[1220px] mx-auto flex items-center">
          <div className="flex items-center sm:gap-4 gap-2 absolute right-5 top-1/2 -translate-y-1/2 text-black">
            <button
              type="button"
              className="sm:p-2 p-1 rounded-full relative sm:bg-secondery"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 max-sm:hidden"
              >
                <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
                <path
                  fillRule="evenodd"
                  d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div
                className="absolute top-0 right-0 -m-1 bg-red-600 text-white text-xs px-1 rounded-full"
                id="notificationsCount"
              >
                {notificationsCount}
              </div>
            </button>

            <div
              className={`hidden bg-white pr-1.5 rounded-lg drop-shadow-xl md:w-[365px] w-screen border2 ${
                isDropdownOpen ? "block" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2 p-4 pb-2">
                <h3 className="font-bold text-xl">Notifications</h3>
              </div>
              <div className="text-sm h-[400px] w-full overflow-y-auto pr-2">
                <div
                  className="pl-2 p-1 text-sm font-normal"
                  id="notification-dropdown"
                >
                  No notifications...
                </div>
              </div>
            </div>

            <div
              className="rounded-full relative bg-secondery cursor-pointer shrink-0"
              onClick={toggleDropdown}
            >
              <img
                src="~/images/avatar/user.png"
                className="sm:w-9 sm:h-9 w-7 h-7 rounded-full shadow shrink-0"
                alt="User Avatar"
              />
            </div>

            <div
              className={`hidden bg-white rounded-lg drop-shadow-xl w-64 border2 ${
                isDropdownOpen ? "block" : ""
              }`}
            >
              <a>
                <div className="p-4 py-5 flex items-center gap-4">
                  <img
                    src="~/images/avatar/user.png"
                    className="w-10 h-10 rounded-full shadow"
                    alt="User Avatar"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-black"></h4>
                    <div className="text-sm mt-1 text-blue-600 font-light/70"></div>
                  </div>
                </div>
              </a>
              <hr />
              <nav className="bg-gray-100 p-4 rounded-md shadow-md">
                {/* {userRole === "user" && (
                  <a href="#" onClick={confirmLogout} className="text-lg">
                    Logout
                  </a>
                )} */}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
