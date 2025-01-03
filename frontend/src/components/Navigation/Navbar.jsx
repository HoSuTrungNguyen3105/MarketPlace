import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowBigDown, LogOut, Search } from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const params = useLocation();
  const searchText = params.search ? params.search.slice(3) : ""; // Lấy giá trị search từ URL nếu có
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    const url = `/search?q=${value}`;
    navigate(url);
  };
  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
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
      {authUser && (
        <button
          className="flex gap-2 items-center text-gray-800 hover:bg-primary/20 transition-colors duration-200"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      )}

      <div className="w-full  min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200 ">
        <div>
          {isSearchPage ? (
            <Link
              to={"/"}
              className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md"
            >
              <ArrowBigDown size={20} />
            </Link>
          ) : (
            <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
              <Search size={22} />
            </button>
          )}
        </div>
        <div className="w-full h-full">
          {!isSearchPage ? (
            //not in search page
            <div
              onClick={redirectToSearchPage}
              className="w-full h-full flex items-center"
            >
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
                onChange={handleOnChange}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
