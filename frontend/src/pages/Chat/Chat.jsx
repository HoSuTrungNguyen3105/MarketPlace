import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ChatContainer from "../../components/ChatBox/ChatContainer";
import NoChatSelected from "../../components/ChatBox/NoChatSelected";
import { useMessageStore } from "../../store/useMessageStore";
import "./Chat.css";

const Chat = () => {
  const { selectedUser } = useMessageStore();
  const [isChatVisible, setIsChatVisible] = useState(true);
  const navigate = useNavigate(); // Hook điều hướng

  // Hàm để toggle hiển thị chatbox
  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  // Hàm để chuyển hướng đến trang /message khi mở rộng chatbox
  const openFullChat = () => {
    navigate("/message"); // Điều hướng đến trang /message
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Chỉ hiển thị nút "Mở rộng Chat" nếu chatbox nhỏ không hiển thị */}
      {!isChatVisible && (
        <button
          className="p-4 bg-blue-500 text-white rounded-full"
          onClick={openFullChat}
        >
          Mở rộng Chat
        </button>
      )}

      {/* Chatbox nhỏ khi ẩn sidebar */}
      <div
        className={`chat-box-container ${isChatVisible ? "block" : "hidden"}`}
        style={{ width: "300px", height: "400px", position: "relative" }}
      >
        <button
          className="absolute top-4 right-4 p-2 bg-gray-500 text-white rounded-full"
          onClick={toggleChatVisibility}
        >
          {isChatVisible ? "Ẩn" : "Hiện"} Chat
        </button>

        {/* Hiển thị ChatContainer nếu có người dùng đã chọn */}
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
};
export default Chat;
