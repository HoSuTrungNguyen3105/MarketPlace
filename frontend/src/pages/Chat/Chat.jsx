import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import NoChatSelected from "../../components/ChatBox/NoChatSelected";
import { useMessageStore } from "../../store/useMessageStore";
import "./Chat.css";

const Chat = () => {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const navigate = useNavigate(); // Hook điều hướng
  const { selectedUser, messages, getMessages, sendMessage } =
    useMessageStore();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage({ content: newMessage });
      setNewMessage(""); // Xóa nội dung sau khi gửi
    }
  };
  // Hàm để toggle hiển thị chatbox
  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  // Hàm để chuyển hướng đến trang /message khi mở rộng chatbox
  const openFullChat = () => {
    navigate("/message"); // Điều hướng đến trang /message
  };
  // if (!selectedUser) {
  //   return <NoChatSelected />;
  // }
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
        <h1>Nhắn tin với {selectedUser}</h1>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.isMine ? "mine" : ""}`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
          />
          <button onClick={handleSendMessage}>Gửi</button>
        </div>
      </div>
    </div>
  );
};
export default Chat;
