import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useMessageStore } from "../../store/useMessageStore";
import SidebarSkeleton from "../Another/SidebarSkeleton";

const Sidebar = () => {
  const {
    getContacts,
    contacts,
    isLoading: isContactsLoading,
    selectedUser,
    setSelectedUser,
  } = useMessageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  // Lọc danh sách users
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.username.toLowerCase();

    return matchesSearch;
  });

  // Hiển thị skeleton khi đang tải dữ liệu
  if (isContactsLoading) return <SidebarSkeleton />;

  return (
    <aside className="lg:w-60 w-16 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-full shadow-lg">
            <MessageCircle className="size-6 text-blue-500" />
          </div>
          <span className="text-lg font-semibold hidden lg:block">
            Tin nhắn
          </span>
        </div>
        <input
          type="text"
          placeholder="Nhập tên người dùng để tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-gray-500 rounded-lg p-2 w-full max-w-xs"
        />
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="hidden custom-checkbox"
            />
            <span className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-md transition-all duration-300 hover:bg-gray-300">
              {showOnlineOnly && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="white"
                  className="w-4 h-4 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            <span className="text-sm">Chỉ hiển thị online</span>
          </label>
          <span className="text-xs text-zinc-500"></span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <button
              key={contact._id}
              onClick={() => setSelectedUser(contact)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === contact._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={contact.profilePic || "/avatar.jpg"}
                  alt={contact.username}
                  className="size-12 object-cover rounded-full"
                />
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{contact.username}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-gray-500">
            Không có liên hệ nào phù hợp.
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
