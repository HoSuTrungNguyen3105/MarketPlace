import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { ArrowBigDown, LetterTextIcon, LogOut, Search } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { usePostStore } from "../../store/userPostStore";

const Navbar = () => {
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchText = location.search ? location.search.slice(3) : ""; // Lấy giá trị query từ URL
  const { logout, authUser } = useAuthStore();

  // Xử lý điều hướng đến trang tìm kiếm
  const redirectToSearchPage = () => navigate("/search");

  // Xử lý thay đổi trong ô tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    const url = `/search?q=${value}`;
    navigate(url);
  };

  // Kiểm tra xem trang hiện tại có phải là trang tìm kiếm hay không
  useEffect(() => {
    setIsSearchPage(location.pathname === "/search");
  }, [location]);

  const handleRedirectByRole = () => {
    switch (authUser?.role) {
      case "admin":
        navigate("/admin");
        break;
      case "seller":
        navigate("/admin");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-base-100/80 backdrop-blur-lg border-b border-base-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <img
              src="https://previews.123rf.com/images/butenkow/butenkow1612/butenkow161200764/67325901-pattern-design-logo-social-vector-illustration-of-icon.jpg"
              className="w-10 h-10 md:block hidden"
              alt="Logo"
            />
          </Link>

          <Link to="/">
            <span className="text-lg font-semibold">Circle App</span>
          </Link>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-1 mx-6">
          <div className="w-full h-11 lg:h-12 rounded-lg border flex items-center bg-slate-50 overflow-hidden focus-within:border-primary-200">
            {isSearchPage ? (
              <Link
                to="/"
                className="flex justify-center items-center h-full px-3 text-gray-500 hover:text-primary"
              >
                <ArrowBigDown size={20} />
              </Link>
            ) : (
              <button
                className="flex justify-center items-center h-full px-3 text-gray-500 hover:text-primary"
                onClick={redirectToSearchPage}
              >
                <Search size={22} />
              </button>
            )}
            <div className="w-full">
              {isSearchPage ? (
                <input
                  type="text"
                  placeholder="Search for atta, dal, and more."
                  autoFocus
                  defaultValue={searchText}
                  className="bg-transparent w-full h-full px-2 outline-none"
                  onChange={handleSearchChange}
                />
              ) : (
                <div
                  onClick={redirectToSearchPage}
                  className="w-full h-full flex items-center cursor-pointer text-gray-400"
                >
                  <TypeAnimation
                    sequence={[
                      'Search "milk"',
                      1000,
                      'Search "bread"',
                      1000,
                      'Search "sugar"',
                      1000,
                      'Search "paneer"',
                      1000,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nút thêm bài đăng */}
        <Link to="/create-post">
          <button
            className="button r-button"
            onClick={() => setModalOpened(true)}
          >
            <LetterTextIcon />
            Thêm Bài Đăng mới
          </button>
        </Link>

        {/* Đăng xuất */}
        {authUser && (
          <button
            className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded transition"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}

        {/* Chuyển đến trang admin/seller theo role */}
        {authUser?.role && (
          <button onClick={handleRedirectByRole}>
            <span>Go to Dashboard</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
