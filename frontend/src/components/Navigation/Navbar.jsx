import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { ArrowBigDown, LetterTextIcon, LogOut, Search } from "lucide-react";
import ShareModal from "../Modal/ShareModal";
import { useAuthStore } from "../../store/useAuthStore";
import { usePostStore } from "../../store/userPostStore";

const Navbar = () => {
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchText = location.search ? location.search.slice(3) : ""; // Lấy giá trị query từ URL
  const { logout, authUser } = useAuthStore();
  const { createPost } = usePostStore();

  // Xử lý điều hướng đến trang tìm kiếm
  const redirectToSearchPage = () => navigate("/search");
  const handleSubmit = async (formData) => {
    const newPost = await createPost(formData);
    if (newPost) {
      setModalOpened(false);
    }
  };
  // Điều hướng đến route được chọn trong modal
  const handleSelect = (route) => {
    navigate(route);
    setModalOpened(false);
  };

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

  return (
    <header className="h-20 lg:shadow-md sticky top-0 z-40 bg-white flex items-center px-4 lg:px-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src="https://previews.123rf.com/images/butenkow/butenkow1612/butenkow161200764/67325901-pattern-design-logo-social-vector-illustration-of-icon.jpg"
          className="w-10 h-10 md:block hidden"
          alt="Logo"
        />
        <span className="text-lg font-semibold">Circle App</span>
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
      <button className="button r-button" onClick={() => setModalOpened(true)}>
        <LetterTextIcon />
        Thêm Bài Đăng mới
      </button>

      {/* Modal thêm bài đăng */}
      {modalOpened && (
        <ShareModal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          onSubmit={handleSubmit}
        />
      )}

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
    </header>
  );
};

export default Navbar;
