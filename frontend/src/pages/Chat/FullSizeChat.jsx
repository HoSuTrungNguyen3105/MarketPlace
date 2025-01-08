import React, { useState } from "react";
import ChatContainer from "../../components/ChatBox/ChatContainer";
import NoChatSelected from "../../components/ChatBox/NoChatSelected";
import Sidebar from "../../components/ChatBox/Sidebar";
import { useMessageStore } from "../../store/useMessageStore";
import { MessageCircleCode } from "lucide-react";

const FullSizeChat = () => {
  const { selectedUser } = useMessageStore();
  const [isChatOpen, setIsChatOpen] = useState(false); // Quản lý trạng thái mở/đóng container

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev); // Đảo ngược trạng thái
  };

  return (
    <div>
      {/* Hiển thị nút bong bóng chat nếu chat bị thu nhỏ */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 flex items-center justify-center h-12 w-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
          title="Mở chat"
        >
          <MessageCircleCode />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-[30rem] h-96 bg-base-100 rounded-lg shadow-lg overflow-hidden border flex transition-all duration-300">
          {/* Sidebar */}
          <div className="w-28 h-full bg-gray-100 border-r flex flex-col">
            <Sidebar />
            <button
              onClick={toggleChat}
              className="mt-auto p-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow"
              title="Đóng chat"
            >
              ➡
            </button>
          </div>

          {/* Chat Container */}
          <div className="flex-1 h-full">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      )}
    </div>
  );
};

export default FullSizeChat;
