import React from "react";

const MiniChat = () => {
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${
              msg.senderId === currentUserId ? "sent" : "received"
            }`}
          >
            <p>{msg.text}</p>
            {msg.image && <img src={msg.image} alt="attachment" />}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MiniChat;
